/**
 * MultiHelp — автоматическая настройка анкет и таблицы.
 *
 * Как запустить:
 *   1. Откройте script.google.com → «Новый проект».
 *   2. Удалите всё в окне и вставьте этот файл целиком. Нажмите «Сохранить» (дискета).
 *   3. Вверху выберите функцию  step1_createForms  → «Выполнить».
 *      Google попросит доступ: «Проверить разрешения» → выберите свой аккаунт →
 *      «Дополнительные настройки» → «Перейти на страницу проекта (небезопасно)» → «Разрешить».
 *      (Это ваш собственный скрипт, предупреждение стандартное.)
 *   4. Добавьте в каждую из трёх анкет 3 вопроса «Загрузка файлов» (список — в журнале выполнения).
 *   5. Выберите функцию  step2_finishSetup  → «Выполнить».
 *   6. Ссылки на анкеты и таблицу — в «Журнале выполнения» внизу.
 */

const CITIES = ['Alicante', 'Elche', 'Benidorm', 'Valencia', 'Madrid', 'Barcelona', 'Otra'];

const TEXTS = {
  ES: {
    file: 'MultiHelp — ES',
    title: 'Únete a MultiHelp',
    description: 'Publica tu perfil gratis en multihelp.es. Los clientes te escriben directamente por WhatsApp, sin comisiones. Rellenar el formulario lleva unos 10 minutos. Revisamos cada perfil y lo publicamos en 1–2 días.',
    confirmation: '¡Gracias! Hemos recibido tu perfil. Lo revisaremos y lo publicaremos en 1–2 días. Si necesitamos algo, te escribiremos por WhatsApp.',
    q: {
      name:    ['Nombre e inicial del apellido', 'Así aparecerá en tu perfil. Ejemplo: Laura M.'],
      role:    ['Profesión', 'Ejemplo: fontanero, videógrafo, entrenador personal, manicurista'],
      cat:     ['Categoría', '', ['Reformas y fontanería', 'Foto y vídeo', 'Deporte y fitness', 'Belleza', 'Clases', 'Hogar y limpieza', 'Otros']],
      city:    ['Ciudad', ''],
      area:    ['Zonas de trabajo', 'Barrios o pueblos donde trabajas. Ejemplo: centro, San Juan, El Campello'],
      langs:   ['Idiomas', 'Idiomas en los que atiendes a tus clientes', ['Español', 'Inglés', 'Ruso', 'Ucraniano', 'Otro']],
      about:   ['Sobre ti', 'Experiencia, qué haces y cómo trabajas. 3–5 frases'],
      svc:     ['Servicios y precios', 'Un servicio por línea: nombre — precio en €. Ejemplo:\nManicura semipermanente — 25\nPedicura — 30'],
      from:    ['Precio desde, €', 'Tu precio mínimo, solo el número. Ejemplo: 25'],
      years:   ['Años de experiencia', 'Solo el número'],
      urgent:  ['Desplazamiento urgente', '¿Puedes ir el mismo día?', ['Sí', 'No']],
      vlinks:  ['Enlaces a vídeos', 'YouTube, Instagram o TikTok. Un enlace por línea'],
      social:  ['Redes sociales y web', 'Instagram, TikTok, Facebook o tu web. Un enlace por línea o tu @usuario de Instagram'],
      wa:      ['WhatsApp', 'Con prefijo, ejemplo: +34 600 000 000. Los clientes te escribirán aquí'],
      phone:   ['Teléfono para llamadas', 'Solo si es distinto del WhatsApp'],
      consent: ['Consentimiento de publicación', 'Puedes pedir que retiremos tu perfil en cualquier momento', ['Acepto que estos datos, fotos y vídeos se publiquen en multihelp.es y confirmo que tengo derecho a publicarlos. He leído la Política de privacidad.']],
      numErr:  'Escribe solo un número'
    },
    uploads: [
      ['Foto de perfil', 'Una foto tuya con buena luz, mirando a cámara', 'solo imágenes, 1 archivo, 10 MB, no obligatoria'],
      ['Fotos de trabajos', 'Hasta 10 fotos claras y con buena luz: es lo primero que ven los clientes', 'solo imágenes, 10 archivos, 10 MB, OBLIGATORIA'],
      ['Vídeos de trabajos', 'Opcional. Hasta 5 vídeos', 'solo vídeo, 5 archivos, 100 MB, no obligatoria']
    ]
  },
  RU: {
    file: 'MultiHelp — RU',
    title: 'Разместите свои услуги на MultiHelp',
    description: 'Разместите профиль бесплатно на multihelp.es. Клиенты пишут вам напрямую в WhatsApp, без комиссий. Заполнение займёт около 10 минут. Мы проверяем каждый профиль и публикуем его за 1–2 дня.',
    confirmation: 'Спасибо! Мы получили ваш профиль. Проверим и опубликуем его за 1–2 дня. Если что-то понадобится, напишем в WhatsApp.',
    q: {
      name:    ['Имя и первая буква фамилии', 'Так будет в вашем профиле. Например: Анна К.'],
      role:    ['Профессия', 'Например: сантехник, видеограф, фитнес-тренер, мастер маникюра'],
      cat:     ['Категория', '', ['Ремонт и сантехника', 'Фото и видео', 'Спорт и фитнес', 'Красота', 'Обучение', 'Дом и уборка', 'Другое']],
      city:    ['Город', ''],
      area:    ['Районы работы', 'Районы или городки, где вы работаете. Например: центр, Сан-Хуан, Эль-Кампельо'],
      langs:   ['Языки', 'На каких языках вы общаетесь с клиентами', ['Испанский', 'Английский', 'Русский', 'Украинский', 'Другой']],
      about:   ['О себе', 'Опыт, что вы делаете и как работаете. 3–5 предложений'],
      svc:     ['Услуги и цены', 'Каждая услуга с новой строки: название — цена в €. Например:\nМаникюр с покрытием — 25\nПедикюр — 30'],
      from:    ['Цена от, €', 'Ваша минимальная цена, только число. Например: 25'],
      years:   ['Опыт, лет', 'Только число'],
      urgent:  ['Срочный выезд', 'Можете приехать в день обращения?', ['Да', 'Нет']],
      vlinks:  ['Ссылки на видео', 'YouTube, Instagram или TikTok. Каждая ссылка с новой строки'],
      social:  ['Соцсети и сайт', 'Instagram, TikTok, Facebook или сайт. Каждая ссылка с новой строки или @ник в Instagram'],
      wa:      ['WhatsApp', 'С кодом страны, например: +34 600 000 000. Сюда вам будут писать клиенты'],
      phone:   ['Телефон для звонков', 'Только если отличается от WhatsApp'],
      consent: ['Согласие на публикацию', 'Вы можете в любой момент попросить удалить профиль', ['Я согласен(на) на публикацию этих данных, фото и видео на multihelp.es и подтверждаю, что имею право их публиковать. Я прочитал(а) Политику конфиденциальности.']],
      numErr:  'Введите только число'
    },
    uploads: [
      ['Фото профиля', 'Ваше фото при хорошем свете, лицом к камере', 'только изображения, 1 файл, 10 МБ, необязательный'],
      ['Фото работ', 'До 10 чётких фото при хорошем свете — их клиенты видят первыми', 'только изображения, 10 файлов, 10 МБ, ОБЯЗАТЕЛЬНЫЙ'],
      ['Видео работ', 'Необязательно. До 5 видео', 'только видео, 5 файлов, 100 МБ, необязательный']
    ]
  },
  EN: {
    file: 'MultiHelp — EN',
    title: 'Join MultiHelp',
    description: 'List your services on multihelp.es for free. Clients message you directly on WhatsApp, with no commission. The form takes about 10 minutes. We review every profile and publish it within 1–2 days.',
    confirmation: "Thank you! We've received your profile. We'll review it and publish it within 1–2 days. If we need anything, we'll message you on WhatsApp.",
    q: {
      name:    ['First name and last initial', 'This is how it will appear on your profile. Example: Laura M.'],
      role:    ['Profession', 'Example: plumber, videographer, personal trainer, nail technician'],
      cat:     ['Category', '', ['Repairs & plumbing', 'Photo & video', 'Sport & fitness', 'Beauty', 'Lessons & tutoring', 'Home & cleaning', 'Other']],
      city:    ['City', ''],
      area:    ['Areas you cover', 'Neighbourhoods or towns where you work. Example: city centre, San Juan, El Campello'],
      langs:   ['Languages', 'Languages you speak with clients', ['Spanish', 'English', 'Russian', 'Ukrainian', 'Other']],
      about:   ['About you', 'Your experience, what you do and how you work. 3–5 sentences'],
      svc:     ['Services and prices', 'One service per line: name — price in €. Example:\nGel manicure — 25\nPedicure — 30'],
      from:    ['Price from, €', 'Your lowest price, number only. Example: 25'],
      years:   ['Years of experience', 'Number only'],
      urgent:  ['Same-day call-outs', 'Can you come the same day?', ['Yes', 'No']],
      vlinks:  ['Video links', 'YouTube, Instagram or TikTok. One link per line'],
      social:  ['Social media and website', 'Instagram, TikTok, Facebook or your website. One link per line, or your Instagram @username'],
      wa:      ['WhatsApp', 'With country code, e.g. +34 600 000 000. Clients will message you here'],
      phone:   ['Phone for calls', 'Only if different from WhatsApp'],
      consent: ['Consent to publish', 'You can ask us to remove your profile at any time', ['I agree to this information, photos and videos being published on multihelp.es and confirm I have the right to publish them. I have read the Privacy Policy.']],
      numErr:  'Please enter a number only'
    },
    uploads: [
      ['Profile photo', 'A well-lit photo of you, facing the camera', 'images only, 1 file, 10 MB, optional'],
      ['Photos of your work', 'Up to 10 clear, well-lit photos — clients see these first', 'images only, 10 files, 10 MB, REQUIRED'],
      ['Videos of your work', 'Optional. Up to 5 videos', 'video only, 5 files, 100 MB, optional']
    ]
  }
};

/* ---------- ШАГ 1: создать три анкеты и таблицу ---------- */
function step1_createForms() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('SHEET_ID')) {
    throw new Error('Анкеты уже созданы. Если хотите создать заново — удалите старые анкеты и таблицу, затем запустите  resetSetup  и снова этот шаг.');
  }
  const ss = SpreadsheetApp.create('MultiHelp — мастера');
  props.setProperty('SHEET_ID', ss.getId());

  ['ES', 'RU', 'EN'].forEach(lang => {
    const t = TEXTS[lang], q = t.q;
    const form = FormApp.create(t.file);
    form.setTitle(t.title)
        .setDescription(t.description)
        .setConfirmationMessage(t.confirmation)
        .setCollectEmail(false)
        .setAllowResponseEdits(true)
        .setProgressBar(false);

    const num = FormApp.createTextValidation().setHelpText(q.numErr).requireNumber().build();

    form.addTextItem().setTitle(q.name[0]).setHelpText(q.name[1]).setRequired(true);
    form.addTextItem().setTitle(q.role[0]).setHelpText(q.role[1]).setRequired(true);
    form.addListItem().setTitle(q.cat[0]).setChoiceValues(q.cat[2]).setRequired(true);
    form.addListItem().setTitle(q.city[0]).setChoiceValues(CITIES).setRequired(true);
    form.addTextItem().setTitle(q.area[0]).setHelpText(q.area[1]);
    form.addCheckboxItem().setTitle(q.langs[0]).setHelpText(q.langs[1]).setChoiceValues(q.langs[2]);
    form.addParagraphTextItem().setTitle(q.about[0]).setHelpText(q.about[1]).setRequired(true);
    form.addParagraphTextItem().setTitle(q.svc[0]).setHelpText(q.svc[1]).setRequired(true);
    form.addTextItem().setTitle(q.from[0]).setHelpText(q.from[1]).setValidation(num);
    form.addTextItem().setTitle(q.years[0]).setHelpText(q.years[1]).setValidation(num);
    form.addMultipleChoiceItem().setTitle(q.urgent[0]).setHelpText(q.urgent[1]).setChoiceValues(q.urgent[2]);
    form.addParagraphTextItem().setTitle(q.vlinks[0]).setHelpText(q.vlinks[1]);
    form.addParagraphTextItem().setTitle(q.social[0]).setHelpText(q.social[1]);
    form.addTextItem().setTitle(q.wa[0]).setHelpText(q.wa[1]).setRequired(true);
    form.addTextItem().setTitle(q.phone[0]).setHelpText(q.phone[1]);
    form.addCheckboxItem().setTitle(q.consent[0]).setHelpText(q.consent[1]).setChoiceValues(q.consent[2]).setRequired(true);

    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    props.setProperty('FORM_' + lang, form.getId());
  });

  Logger.log('ГОТОВО: созданы 3 анкеты и таблица «MultiHelp — мастера».');
  Logger.log('ТЕПЕРЬ: откройте каждую анкету и добавьте В КОНЕЦ (после «Согласия») 3 вопроса типа «Загрузка файлов», в этом порядке:');
  ['ES', 'RU', 'EN'].forEach(lang => {
    const form = FormApp.openById(props.getProperty('FORM_' + lang));
    Logger.log('— ' + TEXTS[lang].file + ': ' + form.getEditUrl());
    TEXTS[lang].uploads.forEach((u, i) => Logger.log('    ' + (i + 1) + '. «' + u[0] + '» — пояснение: «' + u[1] + '» — ' + u[2]));
  });
  Logger.log('После этого запустите функцию  step2_finishSetup.');
}

/* ---------- ШАГ 2: вкладки, служебные столбцы, вкладка «Сайт» ---------- */
function step2_finishSetup() {
  const props = PropertiesService.getScriptProperties();
  const ssId = props.getProperty('SHEET_ID');
  if (!ssId) throw new Error('Сначала запустите step1_createForms.');
  const ss = SpreadsheetApp.openById(ssId);
  const problems = [];

  ['ES', 'RU', 'EN'].forEach(lang => {
    const formId = props.getProperty('FORM_' + lang);
    const sh = ss.getSheets().find(s => { const u = s.getFormUrl(); return u && u.indexOf(formId) !== -1; });
    if (!sh) { problems.push('Не найдена вкладка с ответами анкеты ' + lang + '. Проверьте, что анкета связана с таблицей «MultiHelp — мастера».'); return; }
    if (sh.getName() !== lang) sh.setName(lang);

    const form = FormApp.openById(formId);
    const uploads = form.getItems(FormApp.ItemType.FILE_UPLOAD).length;
    const lastCol = sh.getLastColumn();
    if (uploads !== 3 || lastCol < 20) {
      problems.push('Анкета ' + lang + ': вопросов «Загрузка файлов» — ' + uploads + ' (нужно 3), столбцов в таблице — ' + lastCol + ' (нужно 20). Добавьте недостающие вопросы и запустите шаг 2 снова.');
      return;
    }
    sh.getRange('U1:X1').setValues([['Показывать', 'Свободен сегодня', 'Рейтинг', 'Количество отзывов']]).setFontWeight('bold');
    const cb = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    sh.getRange('U2:V1000').setDataValidation(cb);
    sh.setFrozenRows(1);
  });

  if (problems.length) { problems.forEach(p => Logger.log('⚠ ' + p)); throw new Error('Настройка не закончена — подробности в журнале выше.'); }

  // удалить пустой «Лист1»
  ss.getSheets().forEach(s => {
    if (!s.getFormUrl() && s.getName() !== 'Сайт' && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });

  let site = ss.getSheetByName('Сайт');
  if (!site) site = ss.insertSheet('Сайт');
  site.getRange('A1').setFormula('=VSTACK(ES!A1:X1, IFERROR(FILTER(VSTACK(ES!A2:X, RU!A2:X, EN!A2:X), VSTACK(ES!U2:U, RU!U2:U, EN!U2:U)), ""))');
  ss.setActiveSheet(ss.getSheetByName('ES'));

  Logger.log('ГОТОВО! Таблица: ' + ss.getUrl());
  ['ES', 'RU', 'EN'].forEach(lang => {
    const f = FormApp.openById(props.getProperty('FORM_' + lang));
    Logger.log('Анкета ' + lang + ' (для мастеров): ' + f.getPublishedUrl());
  });
  Logger.log('Осталось вручную: 1) Файл → Поделиться → Опубликовать в интернете → вкладка «Сайт» → CSV → Опубликовать. ' +
             '2) После первых тестовых анкет с фото: открыть доступ «Все, у кого есть ссылка — Читатель» к трём папкам «… (File responses)» на Google Диске.');
}

/* ---------- Сброс (если нужно начать заново) ---------- */
function resetSetup() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  Logger.log('Сброшено. Удалите старые анкеты и таблицу на Google Диске вручную, затем снова запустите step1_createForms.');
}
