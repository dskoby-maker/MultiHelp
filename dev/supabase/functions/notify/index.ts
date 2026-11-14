// MultiHelp — «почтальон»: когда в чате новое сообщение, отправляет уведомление получателю на телефон.
// Установка: Supabase → Edge Functions → Deploy a new function → Via Editor → имя notify → вставить этот код → Deploy.
// Затем в настройках функции выключить «Verify JWT» (Enforce JWT verification).
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const APP = Deno.env.get("APP_URL") ?? "https://dskoby-maker.github.io/MultiHelp/";
webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:no-reply@multihelp.es",
  Deno.env.get("VAPID_PUBLIC")!,
  Deno.env.get("VAPID_PRIVATE")!,
);

Deno.serve(async (req) => {
  let id: number | undefined;
  try { id = Number((await req.json()).id); } catch { /* пусто */ }
  if (!id) return new Response("bad request", { status: 400 });

  // берём сообщение один раз: повторный вызов ничего не отправит
  const { data: m } = await sb.from("messages").update({ notified: true })
    .eq("id", id).eq("notified", false)
    .gt("created_at", new Date(Date.now() - 10 * 60_000).toISOString())
    .select("id, chat_id, sender, body, photo").maybeSingle();
  if (!m) return new Response("skip");

  const { data: c } = await sb.from("chats").select("client, master, client_name, listing_title").eq("id", m.chat_id).single();
  if (!c) return new Response("no chat");
  const fromClient = m.sender === c.client;
  const to = fromClient ? c.master : c.client;
  const who = fromClient ? (c.client_name || "Cliente") : String(c.listing_title || "").split(" · ")[0];
  const payload = JSON.stringify({
    title: `${who} · MultiHelp`,
    body: m.body ? String(m.body).slice(0, 140) : "📷",
    url: `${APP}?chat=${m.chat_id}`,
    tag: `chat-${m.chat_id}`,
  });

  const { data: subs } = await sb.from("push_subs").select("endpoint, p256dh, auth").eq("user_id", to);
  await Promise.all((subs ?? []).map(async (s) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400 });
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) await sb.from("push_subs").delete().eq("endpoint", s.endpoint);
    }
  }));
  return new Response("ok");
});
