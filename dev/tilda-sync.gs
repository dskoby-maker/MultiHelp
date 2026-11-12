/**
 * MultiHelp — перенос анкет с Тильды в таблицу «MultiHelp — база мастеров».
 *
 * Что делает (сам, каждые 5 минут):
 *  1. Находит на Google Диске папку «Tilda Leads» (туда Тильда пишет заявки с форм).
 *  2. Берёт оттуда новые анкеты мастеров (только те, где есть поля lang и profession —
 *     заявки с других сайтов не трогает).
 *  3. Копирует их во вкладку «Анкеты» по названиям столбцов.
 *  4. Фото и видео: находит файлы на Диске, открывает к ним доступ «всем по ссылке»
 *     и записывает постоянные ссылки (ссылки Тильды работают только 10 раз).
 *  5. Присылает вам письмо о каждой новой анкете.
 *  Удалённая из «Анкеты» строка обратно не появится (помощник помнит, что уже переносил).
 *
 * Установка: Расширения → Apps Script → вставить этот код → Сохранить →
 * выбрать функцию «setup» → Выполнить → разрешить доступ. Всё.
 */

const TARGET_TAB = 'Анкеты';
const TILDA_FOLDER = 'Tilda Leads';
const FILE_FIELDS = ['avatar', 'photos', 'videos'];
const NOTIFY_BY_EMAIL = true;

function setup() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncTilda')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncTilda').timeBased().everyMinutes(5).create();
  syncTilda();
  SpreadsheetApp.getActive().toast('Готово: анкеты с Тильды будут переноситься каждые 5 минут.', 'MultiHelp', 8);
}

function syncTilda() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    const ss = SpreadsheetApp.getActive();
    const target = ss.getSheetByName(TARGET_TAB);
    const tHead = target.getRange(1, 1, 1, target.getLastColumn()).getValues()[0].map(h => String(h).trim().toLowerCase());
    const col = name => tHead.indexOf(name);
    if (col('id') < 0) throw new Error('В «Анкеты» нет столбца id');

    const lastRow = target.getLastRow();
    const known = new Set(lastRow > 1
      ? target.getRange(2, col('id') + 1, lastRow - 1, 1).getValues().map(r => String(r[0])).filter(String)
      : []);
    // анкеты, которые уже переносили раньше: если вы удалили строку — она не вернётся
    const props = PropertiesService.getScriptProperties();
    const saved = props.getProperties();
    // анкеты, перенесённые ещё старой версией помощника (до «памяти»), запоминаем сейчас,
    // пока их строки ещё есть в «Анкеты» — тогда после удаления они тоже не вернутся
    const backfill = {};
    known.forEach(id => { if (!saved['seen_' + id]) backfill['seen_' + id] = '1'; });
    if (Object.keys(backfill).length) props.setProperties(backfill);
    Object.keys(saved).forEach(k => { if (k.indexOf('seen_') === 0) known.add(k.slice(5)); });

    const added = [];
    const failed = [];
    const folders = DriveApp.getFoldersByName(TILDA_FOLDER);
    while (folders.hasNext()) {
      const files = folders.next().getFilesByType(MimeType.GOOGLE_SHEETS);
      while (files.hasNext()) {
        const file = files.next();
        if (file.getId() === ss.getId()) continue;
        SpreadsheetApp.openById(file.getId()).getSheets().forEach(sh => {
          const data = sh.getDataRange().getValues();
          if (data.length < 2) return;
          const head = data[0].map(h => String(h).trim().toLowerCase());
          if (head.indexOf('lang') < 0 || head.indexOf('profession') < 0) return; // не наша форма
          const timeCol = head.findIndex(h => /date|time|sent|fecha|дата|время/.test(h));
          data.slice(1).forEach(r => {
            if (!r.some(v => String(v).trim())) return;
            const get = k => { const i = head.indexOf(k); return i < 0 ? '' : String(r[i]).trim(); };
            if (!get('name') || !get('profession')) return;
            const id = 't' + md5(r.join('|')).slice(0, 10);
            if (known.has(id)) return;
            known.add(id);

            try {
              const out = tHead.map(() => '');
              head.forEach((h, i) => {
                const j = col(h);
                if (j < 0 || ['show', 'available_today', 'rating', 'reviews_count', 'id', 'submitted'].indexOf(h) >= 0) return;
                let v = String(r[i]).trim();
                if (FILE_FIELDS.indexOf(h) >= 0) v = fixFileLinks(v);
                out[j] = v;
              });
              out[col('id')] = id;
              if (col('submitted') >= 0) out[col('submitted')] = timeCol >= 0 && r[timeCol] ? r[timeCol] : new Date();
              target.appendRow(out);
              // запоминаем только ПОСЛЕ успешной записи строки: если запись сорвалась,
              // анкета не потеряется и перенесётся при следующем запуске
              props.setProperty('seen_' + id, '1');
              added.push(out);
            } catch (e) {
              failed.push(get('name') + ' — ' + get('profession') + ': ' + e.message);
            }
          });
        });
      }
    }

    if (added.length && NOTIFY_BY_EMAIL) {
      const lines = added.map(o => '• ' + o[col('name')] + ' — ' + o[col('profession')] + ', ' + o[col('city')] + ' (' + o[col('lang')] + ')');
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
        'MultiHelp: новых анкет — ' + added.length,
        'Новые анкеты мастеров:\n\n' + lines.join('\n') +
        '\n\nПроверьте их и поставьте галочку в столбце show, чтобы мастер появился на сайте:\n' + ss.getUrl());
    }
    if (failed.length) {
      console.error('Не удалось перенести анкеты (повтор через 5 минут):\n' + failed.join('\n'));
    }
  } finally {
    lock.releaseLock();
  }
}

/** Заменяет ссылки на файлы постоянными ссылками Google Диска и открывает к ним доступ. */
function fixFileLinks(text) {
  const urls = String(text).match(/https?:\/\/[^\s,;"]+/g) || [];
  return urls.map(u => {
    const id = driveIdFrom(u) || driveIdFrom(resolveRedirects(u));
    if (!id) return u;
    try {
      DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) { /* файл не наш — оставляем как есть */ }
    return 'https://drive.google.com/file/d/' + id + '/view';
  }).join('\n');
}

function driveIdFrom(u) {
  if (!u || !/google\.com/.test(u)) return '';
  const m = u.match(/\/d\/([\w-]{20,})/) || u.match(/[?&]id=([\w-]{20,})/);
  return m ? m[1] : '';
}

/** Проходит по переадресациям (тратит одно из 10 «открытий» ссылки Тильды). */
function resolveRedirects(u) {
  let url = u;
  for (let i = 0; i < 5; i++) {
    let resp;
    try { resp = UrlFetchApp.fetch(url, {followRedirects: false, muteHttpExceptions: true}); } catch (e) { return url; }
    const h = resp.getHeaders();
    const loc = h.Location || h.location;
    if (!loc) {
      const m = resp.getContentText().slice(0, 20000).match(/https:\/\/(?:drive|docs)\.google\.com\/[^"'<>\s]+/);
      return m ? m[0] : url;
    }
    url = loc;
    if (driveIdFrom(url)) return url;
  }
  return url;
}

function md5(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s, Utilities.Charset.UTF_8)
    .map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}
