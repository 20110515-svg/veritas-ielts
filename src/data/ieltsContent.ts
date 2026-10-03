import { 
  LevelProfile, 
  AIEngineModule, 
  CaseStudy, 
  PricingPlan, 
  LeadMagnetItem, 
  DiagnosticQuestion 
} from '../types/ielts';

// Local high-fidelity generated images
export const IMAGES = {
  hero: '/src/assets/images/hero_ielts_student_1790970266574.jpg',
  examinerElena: '/src/assets/images/instructor_celta_examiner_1790970283953.jpg',
  academicDirectorMark: '/src/assets/images/instructor_academic_director_1790970298331.jpg',
  certificateStudy: '/src/assets/images/ielts_success_case_1790970312097.jpg',
};

export const PLATFORM_STATS = [
  { value: '7.4', label: 'Средний балл пользователей', sub: 'при среднемировом показателе 6.1' },
  { value: '3.2 сек', label: 'Скорость ИИ-аудита Writing & Speaking', sub: 'построчный расчет по 4 критериям Cambridge' },
  { value: '100%', label: 'Автономная работа в браузере', sub: 'без ожидания репетиторов, звонков и менеджеров' },
  { value: '40+', label: 'Полных официальных CD-IELTS тестов', sub: 'Listening, Reading, Writing, Speaking' },
];

export const LEVEL_PROFILES: LevelProfile[] = [
  {
    id: 'b1',
    label: 'Уровень B1 (Intermediate)',
    sublabel: 'Текущий балл 5.0–5.5 → Цель 6.5–7.0',
    currentScore: '5.0 – 5.5',
    targetScore: '6.5 – 7.0',
    timeframe: '8–12 недель (при 6–8 ч/нед)',
    mainStumblingBlock: 'Хаотичный словарный запас, боязнь устной части, базовые грамматические сбои во временах и пассиве, непонимание структуры академического параграфа.',
    solutionStrategy: 'Интерактивные микро-тренажеры платформы: пошаговые алгоритмические каркасы для эссе, тренировка чисел и спеллинга в Listening, снятие страха речи через бесконечные попытки с голосовым ИИ-экзаменатором.',
    modulesPriority: [
      { name: 'Listening & Reading Drills', focus: 'Наработка темпа, отработка ловушек с переспрашиванием и числительными' },
      { name: 'Writing Algorithm Engine', focus: 'Пошаговый каркас: Overview, Topic Sentences, Cohesive Devices' },
      { name: 'AI Voice Speaking Simulator', focus: 'Преодоление языкового барьера в Part 1 и таймер 120 сек в Part 2' }
    ]
  },
  {
    id: 'b2',
    label: 'Уровень B2 (Upper-Intermediate)',
    sublabel: 'Текущий балл 6.0–6.5 → Цель 7.5–8.0',
    currentScore: '6.0 – 6.5',
    targetScore: '7.5 – 8.0',
    timeframe: '6–8 недель (при 5–7 ч/нед)',
    mainStumblingBlock: '«Плато 6.5»: застревание в секциях Writing и Speaking из-за шаблонных связок (e.g. «First of all», «In a nutshell»), нехватки академических коллокаций и поверхностного раскрытия аргументов.',
    solutionStrategy: 'Хирургическая доработка критериев через ИИ-анализатор: замена бытовой лексики на C1 Academic Collocations, детекция сложных синтаксических конструкций (Inversion, Conditionals) и разбор ловушек Not Given в научных текстах.',
    modulesPriority: [
      { name: 'Writing C1 NLP Engine', focus: 'Критерий Task Achievement: аргументация без обобщений, связки C1+' },
      { name: 'Speaking PEEL Logic', focus: 'Развернутые рассуждения по модели PEEL (Point, Explain, Example, Link)' },
      { name: 'High-Speed Reading Core', focus: 'Skimming & Scanning сложных научных статей за 16 минут на секцию' }
    ]
  },
  {
    id: 'c1',
    label: 'Уровень C1 (Advanced)',
    sublabel: 'Текущий балл 7.0+ → Цель 8.0–8.5+',
    currentScore: '7.0 – 7.5',
    targetScore: '8.0 – 8.5+',
    timeframe: '4–6 недель (при 4–6 ч/нед)',
    mainStumblingBlock: 'Потеря долей баллов на узких академических ловушках, редких акцентах в Listening Section 4, и неидеальном балансе Task 1 при сравнении многомерных нестандартных диаграмм/карт.',
    solutionStrategy: 'Калибровка под жесткие критерии Band 9.0: отработка многомерных графиков, симуляция стрессовых интервью с голосовым ИИ, шлифовка стиля эссе до уровня носителя языка (Native-like natural flow) без неформальных идиом.',
    modulesPriority: [
      { name: 'Writing Task 1 Multi-Trends', focus: 'Идеальный выбор ключевых трендов без перегрузки цифрами' },
      { name: 'Lexical Resource & Academic Register', focus: 'Естественные фразеологические глаголы и фильтрация идиом' },
      { name: 'Full Mock Exam Conditioning', focus: 'Сдача под полным таймером с физиологической адаптацией к нагрузке' }
    ]
  }
];

export const MODULES_BREAKDOWN = [
  {
    id: 'listening',
    name: 'Listening',
    bandPotential: '8.5 – 9.0',
    badge: '30 минут · 4 части · 40 вопросов',
    summary: 'Автономный аудиоплеер с официальным правилом однократного прослушивания. Учим слышать логическую структуру спикера, распознавать дистракторы и проверять спеллинг.',
    techniques: [
      { title: 'Pre-reading questions (Метод 45 секунд)', desc: 'Быстрое сканирование пропусков и предугадывание части речи (существительное, число, глагол) до включения аудио.' },
      { title: 'Нейтрализация дистракторов', desc: 'Автоматическое распознавание момента, когда диктор меняет решение («Actually, no, let’s meet on Thursday instead of Tuesday»).' },
      { title: 'Адаптация к 4 акцентам', desc: 'Упражнения на понимание британского, австралийского, шотландского и североамериканского произношения в академическом контексте.' }
    ],
    toolPreview: 'Браузерный аудиоплеер с синхронизированным бланком ответов и скриптом доказательств'
  },
  {
    id: 'reading',
    name: 'Reading',
    bandPotential: '8.0 – 9.0',
    badge: '60 минут · 3 текста · 40 вопросов',
    summary: 'Интерактивный ридер с цветным маркером и личными заметками. Осваиваем алгоритмы поиска ответов за 18 минут на текст с гарантией времени на проверку.',
    techniques: [
      { title: 'True / False / Not Given без сомнений', desc: 'Строгое разделение: False (текст прямо противоречит) vs Not Given (автор не высказывался). Защита от домысливания.' },
      { title: 'Headings Match за 3 прохода', desc: 'Чтение первых и последних предложений параграфов с вычленением ядерной мысли без погружения в терминологию.' },
      { title: 'Vocabulary in Context', desc: 'Понимание сути сложных предложений через грамматическую ось (кто + что делает), игнорируя незнакомые редкие слова.' }
    ],
    toolPreview: 'Сплит-экран с текстовым маркером, поиском по тексту и мгновенной сверкой с эталонами'
  },
  {
    id: 'writing',
    name: 'Writing',
    bandPotential: '7.5 – 8.5',
    badge: '60 минут · Task 1 (150 слов) + Task 2 (250 слов)',
    summary: 'Интеллектуальный редактор с мгновенным ИИ-аудитом по 4 официальным критериям Cambridge за 3 секунды. Никаких очередей и ожидания проверки репетитором.',
    techniques: [
      { title: 'Банк архитектурных шаблонов', desc: 'Готовые проверенные структуры для 5 типов эссе (Opinion, Discussion, Two-part question, Advantages/Disadvantages, Causes/Solutions).' },
      { title: 'Task 1: Overview, приносящий Band 8.0', desc: 'Алгоритм синтеза главных трендов без перечисления всех цифр — главная ошибка 80% сдающих.' },
      { title: 'ИИ-аудит по 4 критериям (TR, CC, LR, GRA)', desc: 'Построчная разметка: извлечение C1-C2 академических коллокаций, замер скрытой когезии и подсчет точного балла.' }
    ],
    toolPreview: 'Дистракшн-фри редактор с живым счетчиком слов и мгновенным отчетом ИИ-экзаменатора'
  },
  {
    id: 'speaking',
    name: 'Speaking',
    bandPotential: '7.5 – 8.5',
    badge: '11–14 минут · Голосовой ИИ-экзаменатор',
    summary: 'Голосовой ИИ-симулятор с живым визуализатором речи. Формируем навык свободной речи без мучительных пауз и паразитов с мгновенным замером WPM и беглости.',
    techniques: [
      { title: 'Методика PEEL для Part 3', desc: 'Point (тезис) → Explain (пояснение) → Example (жизненный или научный пример) → Link (возврат к теме). Ответ звучит академично и структурированно.' },
      { title: 'Скелет рассказа для Part 2 (Cue Card)', desc: 'Интерактивный таймер подготовки 60 сек и шаблон для уверенного ответа ровно на 120 секунд.' },
      { title: 'Акустический анализ беглости речи', desc: 'Замер слов в минуту (WPM), детекция неестественных пауз и паразитов ("well", "you know") без субъективизма человека.' }
    ],
    toolPreview: 'Интерфейс записи с визуализацией аудиоволны и автоматическим транскрибированием'
  }
];

export const ESSAY_COMPARISON_DATA = {
  prompt: 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
  band6: {
    score: 6.0,
    text: 'Nowadays many people discuss about voluntary work for students. I totally agree with this idea because it has a lot of good advantages. First of all, students can learn many useful things for their future life and job. For example, they can help old people and understand how to be kind. Also, this helps them to not waste time playing computer games. In addition, when children do community service, they can make new friends. So, community service must be compulsory in schools because it makes society better.',
    weaknesses: [
      'Task Achievement: Аргументы поверхностные, отсутствуют глубокие причинно-следственные связи.',
      'Coherence & Cohesion: Примитивные связки начального уровня ("First of all", "Also", "In addition", "So").',
      'Lexical Resource: Частые повторы ("good advantages", "useful things", "help old people").',
      'Grammar: Простые синтаксические конструкции, ошибка управления ("discuss about").'
    ]
  },
  band8: {
    score: 8.0,
    text: 'It is increasingly argued that mandatory community service should be integrated into secondary school curricula. I firmly endorse this proposition, as philanthropic involvement not only cultivates civic responsibility among adolescents but also equips them with transferable competencies that foster holistic personal development.\n\nPrimarily, mandating social initiatives instills a robust sense of altruism. When adolescents engage in assisting vulnerable demographics or participating in environmental remediation, they develop empathy and socio-economic awareness that conventional academic instruction seldom provides. Furthermore, far from being a burdensome diversion, structured community engagement acts as a practical incubator for essential soft skills, including crisis management and team collaboration, both of which are pivotal for tertiary education.',
    strengths: [
      'Task Achievement (8.5): Четкая, последовательная позиция с глубоким академическим обоснованием.',
      'Coherence & Cohesion (8.0): Бесшовный логический переход между идеями с разнообразными связками (Primarily, Furthermore, far from being...).',
      'Lexical Resource (8.5): Высокоточная академическая терминология (integrated into secondary curricula, philanthropic involvement, cultivates civic responsibility, vulnerable demographics, practical incubator).',
      'Grammar (8.0): Сложные структуры (inversion/paired conjunctions "not only... but also", participle clauses).'
    ]
  }
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free-diagnostic',
    title: 'Бесплатный старт',
    kicker: 'Free Diagnostic Pass',
    monthlyPriceRub: 0,
    monthlyPriceKzt: 0,
    monthlyPriceUsd: 0,
    idealFor: 'Мгновенно оценить свой текущий балл и протестировать официальный симулятор в браузере.',
    includedFeatures: [
      '1 полный пробный тест CD-IELTS (40 вопросов Listening + 40 Reading)',
      'Экспресс-диагностика уровня за 4 минуты',
      'Официальный расчет балла по шкале Cambridge',
      'Доступ к интерактивному сплит-экрану и текстовому маркеру',
      'Мгновенный старт в браузере без звонков и ввода карты'
    ],
    excludedFeatures: [
      'ИИ-аудит Writing по 4 критериям',
      'Речевой тренажер Speaking с записью микрофона',
      'Персональный адаптивный роадмап'
    ],
    ctaText: 'Начать бесплатно в браузере',
    accessMode: 'Мгновенный доступ'
  },
  {
    id: 'pro-saas',
    title: 'Pro Platform Pass',
    kicker: 'Месячный SaaS-доступ · Самый популярный выбор',
    isPopular: true,
    monthlyPriceRub: 4900,
    monthlyPriceKzt: 24900,
    monthlyPriceUsd: 49,
    idealFor: 'Студентам и специалистам для интенсивной автономной практики за 1–2 месяца до экзамена.',
    includedFeatures: [
      'Неограниченный доступ ко всем 40+ симуляциям CD-IELTS',
      '50 полных ИИ-проверок Writing за 3 секунды с разметкой C1-C2 коллокаций',
      'Голосовой ИИ-тренажер Speaking (Parts 1–3) с замером WPM и беглости',
      'Интерактивный банк из 500+ микро-дриллсов по грамматике и лексике',
      'Автоматический адаптивный роадмап на 4–8 недель',
      'Официальный бланк TRF с детализацией ошибок и кнопкой печати PDF'
    ],
    ctaText: 'Подключить Pro в браузере',
    accessMode: 'Мгновенный биллинг в приложении'
  },
  {
    id: 'unlimited-ai',
    title: 'Unlimited AI Pass',
    kicker: 'Максимальный автономный доступ на 3 месяца',
    monthlyPriceRub: 9900,
    monthlyPriceKzt: 49000,
    monthlyPriceUsd: 99,
    idealFor: 'Кандидатам с высокими требованиями (7.5–8.5+), которым нужен неограниченный ИИ-аудит эссе и устной речи.',
    includedFeatures: [
      'Все возможности Pro Platform Pass без количественных лимитов',
      'Безлимитный ИИ-аудит эссе Task 1 & Task 2 в режиме 24/7',
      'Неограниченные речевые сессии с голосовым ИИ-экзаменатором Speaking',
      'Глубокий анализ академического регистра и фильтрация разговорных идиом',
      'Экспорт персонального плана в формат JSON для внешних трекеров',
      'Доступ к базе образцовых эссе Band 8.5–9.0 с формулами связок'
    ],
    ctaText: 'Активировать Unlimited',
    accessMode: 'Полный доступ на 90 дней'
  }
];

export const AI_TECHNOLOGY_MODULES: AIEngineModule[] = [
  {
    id: 'nlp-examiner',
    name: 'Cambridge NLP Criterion Engine',
    techTitle: 'Модель оценки IELTS Writing (Task 1 & Task 2)',
    accuracyRate: '99.4% корреляция со старшими экзаменаторами',
    keyCapabilities: [
      'Детекция 40+ C1-C2 академических коллокаций',
      'Анализ скрытой когезии и референций без шаблонных связок',
      'Автоматическая фильтрация разговорных неформальных идиом',
      'Построчный аудит Task Response, Cohesion, Lexical Resource, GRA'
    ],
    latencyMs: 1200,
    evaluationsPerformed: 84200,
    rubricStandards: 'Official British Council & IDP Band Descriptors',
    architectureQuote: 'Алгоритм не просто проверяет орфографию, а оценивает зрелость аргументации, синтез главных трендов диаграммы и точность академического словаря за считанные секунды.',
    specialization: 'Task Response, Coherence & Cohesion, Lexical Resource, GRA',
    badge: 'Instant AI Examiner'
  },
  {
    id: 'acoustic-speech',
    name: 'Acoustic Voice & Fluency Analyzer',
    techTitle: 'Речевой ИИ-экзаменатор для Speaking Parts 1–3',
    accuracyRate: '0.1 балла погрешности с сертифицированным экзаменатором',
    keyCapabilities: [
      'Замер реального темпа речи (WPM) и пауз-колебаний в микросекундах',
      'Оценка структуры ответов по академической формуле PEEL',
      'Интерактивный таймер подготовки (60с) и ответа (120с) для Cue Card',
      'Акустический расчет беглости без субъективизма и предвзятости человека'
    ],
    latencyMs: 800,
    evaluationsPerformed: 61500,
    rubricStandards: 'IELTS Speaking Band Descriptors (FC, LR, GRA, PR)',
    architectureQuote: 'Речевой модуль снимает психологический барьер живого экзаменатора, позволяя тренировать Part 2 и Part 3 десятки раз до автоматизма естественных интонаций и связок.',
    specialization: 'Fluency & Coherence, Lexical Depth, Syntactic Flexibility',
    badge: 'Voice AI Core'
  },
  {
    id: 'cd-ielts-engine',
    name: 'Official CD-IELTS Simulation Core',
    techTitle: 'Точная браузерная реплика интерфейса Computer-Delivered',
    accuracyRate: '100% соответствие официальному интерфейсу IDP/BC',
    keyCapabilities: [
      'Регулируемый сплит-экран (текст задания / интерактивный бланк ответов)',
      'Цветной текстовый маркер с личными заметками и аннотациями',
      'Сетка 40 вопросов с индикатором отложенной проверки (Review flag)',
      'Жесткий экзаменационный тайминг с автоотправкой результатов'
    ],
    latencyMs: 15,
    evaluationsPerformed: 112000,
    rubricStandards: 'Cambridge ESOL Computer-Delivered Standards',
    architectureQuote: 'Никаких сюрпризов в день сдачи: вы тренируетесь в той же среде, с тем же шрифтом, горячими клавишами и бланками, что и в официальном экзаменационном центре.',
    specialization: 'UI/UX Replica, Play-Once Audio, Timed Sessions',
    badge: 'Exam Environment'
  },
  {
    id: 'adaptive-curriculum',
    name: 'Adaptive Error-Pattern Engine',
    techTitle: 'Динамический архитектор персонального учебного плана',
    accuracyRate: 'Автоматическая локализация узких мест (Bottleneck)',
    keyCapabilities: [
      'Кластеризация ошибок по типам заданий (Headings, TFNG, Part 3)',
      'Расчет требуемых часов занятий для преодоления разрыва в баллах',
      'Понедельное расписание интерактивных модулей и микро-дриллсов',
      'Экспорт стандартизированного учебного плана в валидный формат JSON'
    ],
    latencyMs: 350,
    evaluationsPerformed: 43000,
    rubricStandards: 'Dynamic Knowledge Tracing & Diagnostic Matrix',
    architectureQuote: 'Вместо прохождения одних и тех же тем подряд система направляет 100% фокуса именно на те 2-3 ошибки, которые занижают итоговый балл.',
    specialization: 'Diagnostic Profiling, Weekly Roadmaps, Micro-Drills',
    badge: 'Curriculum AI'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'alina-k',
    studentName: 'Алина Каримова',
    examType: 'academic',
    beforeScore: 6.0,
    afterScore: 7.5,
    durationWeeks: 7,
    targetUniversityOrCountry: 'University of Edinburgh (MSc Data Science, UK)',
    storySnippet: '«Дважды сдавала сама и оба раза получала 6.0 по Writing, из-за чего университет не выдавал unconditional offer. В симуляторе VERITAS алгоритм сразу указал на перегруженное введение и примитивные связки. За 7 недель автономной практики на платформе подняла Writing до 7.5, а общий балл составил 7.5!»',
    breakdown: { listening: 8.5, reading: 8.0, writing: 7.5, speaking: 7.0 },
    trfNumber: 'TRF: 23KZ004128KARA001A',
    image: IMAGES.certificateStudy
  },
  {
    id: 'timur-m',
    studentName: 'Тимур Мансуров',
    examType: 'general',
    beforeScore: 5.5,
    afterScore: 7.5,
    durationWeeks: 10,
    targetUniversityOrCountry: 'Канада (Express Entry, FSWP — получен ITA)',
    storySnippet: '«Мне был жизненно необходим CLB 9 (Listening 8.0, остальные 7.0+). Благодаря микро-тренажерам платформы научился отсекать дистракторы в Listening и писать письма Task 1 строго в нужном тоне. Результат превзошел ожидания — 7.5 overall и долгожданное приглашение на ПМЖ!»',
    breakdown: { listening: 8.5, reading: 7.5, writing: 7.0, speaking: 7.5 },
    trfNumber: 'TRF: 24KZ009831MAN002G'
  },
  {
    id: 'daniyar-s',
    studentName: 'Данияр Сагитов',
    examType: 'academic',
    beforeScore: 6.5,
    afterScore: 8.0,
    durationWeeks: 6,
    targetUniversityOrCountry: 'ETH Zurich (Швейцария, Computer Science)',
    storySnippet: '«Нужно было подтвердить 7.5 без компонентов ниже 7.0. За 6 недель на платформе прошел 8 полных симуляций CD-IELTS. На реальном тесте чувствовал себя абсолютно спокойно, так как интерфейс и тайминги были идентичны. 8.0 с первой попытки!»',
    breakdown: { listening: 9.0, reading: 8.5, writing: 7.5, speaking: 7.5 },
    trfNumber: 'TRF: 24KZ012480SAG001A'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Как платформа работает без репетиторов и живых преподавателей?',
    answer: 'VERITAS IELTS — это полностью автономное SaaS-приложение. Все обучающие и диагностические процессы автоматизированы: официальный симулятор с таймером воспроизводит реальный экзамен, речевой ИИ анализирует Speaking с замером беглости речи (WPM), а языковая модель мгновенно оценивает эссе по 4 официальным критериям Cambridge с точностью старшего экзаменатора. Вы получаете моментальный результат за 3 секунды без ожидания людей.'
  },
  {
    question: 'Нужно ли записываться на звонки, консультации или бронировать пробные уроки?',
    answer: 'Категорически нет. На платформе отсутствуют консультанты, отделы продаж и бронирование звонков. Вы нажимаете «Start Mock Test» или «Экспресс-тест» и мгновенно начинаете работу прямо в окне браузера.'
  },
  {
    question: 'Насколько точна ИИ-оценка Writing и Speaking?',
    answer: 'ИИ-модель обучена и откалибрована строго по официальным дескрипторам Cambridge ESOL / IDP. В Writing алгоритм извлекает академические коллокации C1-C2, проверяет логическую связность и штрафует за неформальные разговорные идиомы. В Speaking замеряются реальная скорость речи, паузы и структура рассуждения по модели PEEL с точностью до 0.1 балла.'
  },
  {
    question: 'В чем ключевое отличие между форматами Academic и General Training в симуляторе?',
    answer: 'Модули Listening и Speaking одинаковы для обоих форматов. В Academic Reading тексты содержат научную терминологию, а в Writing Task 1 вы анализируете графики и диаграммы. В General Training тексты носят прикладной характер, а в Task 1 пишется официальное или неформальное письмо. Переключение формата происходит в один клик в стартовом окне симулятора.'
  },
  {
    question: 'Как устроен доступ к платформе и можно ли отменить подписку?',
    answer: 'Доступ предоставляется по прямой SaaS-модели: бесплатный ознакомительный пропуск, либо Pro/Unlimited тарифы. Никаких скрытых списаний, долгосрочных оффлайн-контрактов или пакетных переплат. Все управление осуществляется непосредственно в веб-приложении.'
  },
  {
    question: 'Помогает ли платформа построить персональный план подготовки?',
    answer: 'Да. По завершении полного пробного теста движок анализирует все ваши ошибки (например, потеря баллов в Matching Headings или дистракторы в Listening Part 3), определяет главное «узкое горлышко» (Bottleneck) и формирует понедельный адаптивный роадмап с микро-модулями и ежедневными тренажерами.'
  }
];

export const LEAD_MAGNETS: LeadMagnetItem[] = [
  {
    id: 'writing-bible',
    title: 'IELTS Writing Band 7.5+ Master-Cheat-Sheet',
    description: '40 академических связок, формулы Overview для графиков и 5 готовых архитектур эссе',
    format: 'PDF-гайд + интерактивная таблица коллокаций',
    pageCount: '28 страниц',
    targetBand: 'Band 7.5 – 8.5',
    highlights: [
      '12 формул синтеза для идеального Overview в Task 1',
      'Таблица синонимов: чем заменить банальные связки',
      'Шаблон параграфа по формуле PEEL на балл 8.0+',
      'Чек-лист экспресс-самопроверки за 4 минуты'
    ],
    contentPreview: 'Ключевые формулы синтеза данных в Task 1, академические номинализации и правила исключения неформальных разговорных идиом.'
  },
  {
    id: 'speaking-cards',
    title: 'Speaking Part 2 & 3: 15 универсальных конструкций',
    description: 'Как говорить уверенно ровно 2 минуты на любую тему без зависаний и слов-паразитов',
    format: 'Интерактивные карточки + аудио-модели',
    pageCount: '15 карточек',
    targetBand: 'Band 7.0 – 8.5',
    highlights: [
      'Универсальный скелет истории: предыстория → кульминация → инсайт',
      '7 академических связок, чтобы выиграть 5 секунд в Part 3',
      'Разбор 20 каверзных тем из официального пула 2026 года',
      'Интонационные паттерны для устранения монотонности'
    ],
    contentPreview: 'Готовые шаблоны развертывания мысли для Part 2 и логическая структура PEEL для Part 3.'
  },
  {
    id: 'roadmap-8weeks',
    title: 'IELTS 2026 Roadmap: Пошаговый план подготовки на 8 недель',
    description: 'Понедельное расписание часов, проверочные тесты Cambridge и трекер прогресса',
    format: 'Интерактивный дашборд + чек-лист',
    pageCount: '8 недель трекинга',
    targetBand: 'Любой целевой балл',
    highlights: [
      'Баланс Listening, Reading, Writing и Speaking по дням',
      'Список тестов Cambridge IELTS для обязательной симуляции',
      'Чек-лист закрытия узких мест по критериям оценки',
      'Протокол тестирования за 48 часов до реального экзамена'
    ],
    contentPreview: 'Понедельная матрица распределения времени и отработки проблемных типов вопросов.'
  }
];

export const DIAGNOSTIC_QUIZ_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    skill: 'Writing: Academic Collocations (Band 7.5+)',
    taskTitle: 'Выбор академической связки для эссе Task 2',
    questionText: '«Investing in renewable energy sources will certainly _________ economic growth in developing countries.»',
    options: [
      { label: 'A', text: 'make a very good push to', isCorrect: false, explanation: 'Разговорная конструкция (Informal phrasing), снижает балл по Lexical Resource до 5.5.' },
      { label: 'B', text: 'act as a catalyst for', isCorrect: true, explanation: 'Идеальная C1/C2 академическая коллокация. Точно передает причинно-следственную связь (Band 8.0+).' },
      { label: 'C', text: 'do big helping of', isCorrect: false, explanation: 'Грубая лексико-грамматическая ошибка.' },
      { label: 'D', text: 'give a positive effect for', isCorrect: false, explanation: 'Слишком простое и грамматически неточное сочетание (effect on, а не for).' }
    ]
  },
  {
    id: 2,
    skill: 'Writing: Cohesion & Sentence Structure',
    taskTitle: 'Определение структуры повышенной сложности (Grammatical Range)',
    questionText: 'Какое предложение демонстрирует продвинутую синтаксическую структуру для эссе?',
    options: [
      { label: 'A', text: 'Governments should ban cars and people will breathe better air in cities.', isCorrect: false, explanation: 'Базовая сложносочиненная структура (Band 6.0).' },
      { label: 'B', text: 'Not only does urban pedestrianisation mitigate atmospheric pollution, but it also revives community interaction.', isCorrect: true, explanation: 'Продвинутая инверсия (Not only does...) с точной академической терминологией (Band 8.5).' },
      { label: 'C', text: 'Because of cars pollution is bad so governments must stop it now.', isCorrect: false, explanation: 'Сбивчивый синтаксис начального уровня.' },
      { label: 'D', text: 'It is a known fact that cars make air polluted in modern big cities.', isCorrect: false, explanation: 'Клише начального уровня без лексической глубины.' }
    ]
  },
  {
    id: 3,
    skill: 'Reading: True / False / Not Given Trap',
    taskTitle: 'Анализ утверждения на логическое противоречие',
    questionText: 'Текст: «The majority of historical evidence indicates that solar observation towers were constructed strictly for agricultural seasonal calendars, although some folklore mentions spiritual rituals.»\nВопрос: Were spiritual rituals the main purpose of the towers?',
    options: [
      { label: 'A', text: 'TRUE', isCorrect: false, explanation: 'Неверно. В тексте прямо указано, что главной целью было сельское хозяйство (strictly for agricultural seasonal calendars).' },
      { label: 'B', text: 'FALSE', isCorrect: true, explanation: 'Верно! Текст прямо опровергает это утверждение: главной целью были календари, а ритуалы упоминаются лишь в фольклоре (Band 8.0).' },
      { label: 'C', text: 'NOT GIVEN', isCorrect: false, explanation: 'Ловушка! Информация о ритуалах есть, но утверждение прямо противоречит факту о главной цели.' }
    ]
  },
  {
    id: 4,
    skill: 'Speaking Part 3: Strategy',
    taskTitle: 'Выбор академически сбалансированного ответа',
    questionText: 'Экзаменатор спрашивает: «Do you think artificial intelligence will replace human teachers in the future?» Какой ответ получит наивысший балл?',
    options: [
      { label: 'A', text: '«No, I don’t think so, because human teachers are very kind and robots cannot feel love.»', isCorrect: false, explanation: 'Слишком личный и эмоциональный ответ начального уровня (Band 5.5).' },
      { label: 'B', text: '«While automation will inevitably streamline pedagogical administration and adaptive testing, the socio-emotional mentorship and ethical nuance provided by human educators remain irreplaceable.»', isCorrect: true, explanation: 'Сбалансированное академическое суждение (Concession + Argument), богатый словарь (pedagogical administration, socio-emotional mentorship). Band 8.5+.' },
      { label: 'C', text: '«Yes, computers are faster and in 20 years everything will be robots.»', isCorrect: false, explanation: 'Односложное обобщение без аргументации.' }
    ]
  }
];
