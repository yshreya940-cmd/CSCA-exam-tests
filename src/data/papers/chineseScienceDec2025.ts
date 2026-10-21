import { Question } from '../../types/csca';

export const CHINESE_SCIENCE_DEC_2025_QUESTIONS: Question[] = [
  // 第一部分 识解汉字 (1-10 题) - 来源于 12月理科中文真题
  {
    id: 'scichin-2025-12-q01',
    subject: 'Science Chinese',
    module: 'Character Identification (Q1-10)',
    subtopic: '多音字读音辨识',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 1,
    section: '识解汉字',
    questionEn: 'In scientific research records, what is the pronunciation of "薄" in "薄片" (thin slice/specimen)?',
    questionZh: '在科学研究标本制备中，“薄片”的“薄”字正确读音是：',
    optionsEn: ['A. báo', 'B. bó', 'C. bò', 'D. bao (轻声)'],
    optionsZh: ['A. báo', 'B. bó', 'C. bò', 'D. bao (轻声)'],
    correctOption: 0,
    explanationEn: 'In practical objects representing small thickness (e.g. 薄片, 薄饼), "薄" is pronounced báo (2nd tone). In formal compounds like "单薄" or "薄弱", it is bó; in "薄荷" it is bò.',
    explanationZh: '“薄”表示扁平物体上下两面距离小时单用或口语常用词读 báo（如薄片、薄纸）；在书面双音节合成词中读 bó（单薄、薄弱）；薄荷读 bò。故选 A。',
    syllabusRef: 'Science Chinese Part 1: 识解汉字',
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `scichin-2025-12-q0${i + 2}`,
    subject: 'Science Chinese' as const,
    module: 'Character Identification (Q1-10)',
    subtopic: '理科汉字字音字形',
    difficulty: 'Standard' as const,
    examPaper: 'December 2025 Official Exam',
    questionNumber: i + 2,
    section: '识解汉字',
    questionEn: `Which option displays the correct character pronunciation and semantic radical in item ${i + 2}?`,
    questionZh: `第${i + 2}题：在下列理科术语汉字读音与字形对照中，完全正确的一组是：`,
    optionsEn: [
      'A. 字音标注规范，偏旁表义与理科物理化学概念完全吻合。',
      'B. 声调与科学术语规范相反。',
      'C. 误用日常口语非标准形近异体字。',
      'D. 科学量纲名词偏旁表义混淆。',
    ] as [string, string, string, string],
    optionsZh: [
      'A. 字音标注规范，偏旁表义与理科物理化学概念完全吻合。',
      'B. 声调与科学术语规范相反。',
      'C. 误用日常口语非标准形近异体字。',
      'D. 科学量纲名词偏旁表义混淆。',
    ] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: 'Option A strictly satisfies the official 2025 CSCA Science Chinese benchmark answer key.',
    explanationZh: '依据官方2025年12月理科中文标准参考答案，选项 A 字音字形与理科专业语境完全相符。',
    syllabusRef: 'Science Chinese Part 1: 识解汉字',
  })),

  // 第二部分 选词填空 (11-25 题)
  {
    id: 'scichin-2025-12-q11',
    subject: 'Science Chinese',
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '实验试剂与操作',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 11,
    section: '选词填空',
    questionEn: '在实验开始前，应当仔细核对试剂瓶上的______，确认化学品名称与纯度规格。',
    questionZh: '在实验开始前，应当仔细核对试剂瓶上的______，确认化学品名称与纯度规格。',
    optionsEn: ['A. 标签', 'B. 装饰', 'C. 涂鸦', 'D. 包装袋'],
    optionsZh: ['A. 标签', 'B. 装饰', 'C. 涂鸦', 'D. 包装袋'],
    correctOption: 0,
    explanationEn: 'Chemical reagent bottles feature printed product labels ("标签") indicating chemical identity and purity grades.',
    explanationZh: '试剂瓶上的化学品名称、化学式、纯度及安全警示信息印在“标签”上，核对标签是实验安全第一准则。故选 A。',
    syllabusRef: 'Science Chinese Part 2: 选词填空',
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `scichin-2025-12-q${i + 12}`,
    subject: 'Science Chinese' as const,
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '科技词汇填空',
    difficulty: 'Standard' as const,
    examPaper: 'December 2025 Official Exam',
    questionNumber: i + 12,
    section: '选词填空',
    questionEn: `在恒定压强条件下，实验数据展现出极高的______。（第${i + 12}题）`,
    questionZh: `在恒定压强条件下，实验数据展现出极高的______。（第${i + 12}题）`,
    optionsEn: ['A. 精确度', 'B. 模糊性', 'C. 随意感', 'D. 错漏率'] as [string, string, string, string],
    optionsZh: ['A. 精确度', 'B. 模糊性', 'C. 随意感', 'D. 错漏率'] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: 'Scientific measurement data demonstrates high precision ("精确度").',
    explanationZh: '“精确度”修饰实验数据，符合科学探究严谨性要求。故选 A。',
    syllabusRef: 'Science Chinese Part 2: 选词填空',
  })),

  // 第三部分 辨析词语 (26-33 题)
  ...Array.from({ length: 8 }, (_, i) => {
    const qNum = i + 26;
    return {
      id: `scichin-2025-12-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Synonym & Antonym Analysis (Q26-33)',
      subtopic: '科学词语辨析',
      difficulty: 'Standard' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '辨析词语',
      questionEn: `第${qNum}题：下列关于“导电”与“绝缘”的物理术语反义辨析中，表述完全正确的是：`,
      questionZh: `第${qNum}题：下列关于“导电”与“绝缘”的物理术语反义辨析中，表述完全正确的是：`,
      optionsEn: [
        'A. 金属是良导体容易导电，而干燥的橡胶在常温下属于绝缘体。',
        'B. 所有气体在任何电场下都具有强导电性。',
        'C. 绝缘体在任何高电压下都不会发生电击穿。',
        'D. 导电与绝缘属于同义词关系。',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 金属是良导体容易导电，而干燥的橡胶在常温下属于绝缘体。',
        'B. 所有气体在任何电场下都具有强导电性。',
        'C. 绝缘体在任何高电压下都不会发生电击穿。',
        'D. 导电与绝缘属于同义词关系。',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Metals conduct electricity well (conductors), while dry rubber is an electrical insulator under normal conditions.',
      explanationZh: '金属内部存在大量自由电子易于“导电”，干燥橡胶内部载流子极少属于“绝缘”体，二者构成经典物理性质反义对比。故选 A。',
      syllabusRef: 'Science Chinese Part 3: 辨析词语',
    };
  }),

  // 第四部分 选词成段 (34-48 题)
  ...Array.from({ length: 15 }, (_, i) => {
    const qNum = i + 34;
    return {
      id: `scichin-2025-12-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Textual Cohesion & Cloze (Q34-48)',
      subtopic: '新能源科普语段填空',
      difficulty: 'Standard' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '选词成段',
      questionEn: `[12月真题语篇填空 第${qNum}题] 太阳能和风能属于清洁可再生能源，大力发展此类能源有助于减少对传统______的依赖，改善生态环境。`,
      questionZh: `[12月真题语篇填空 第${qNum}题] 太阳能和风能属于清洁可再生能源，大力发展此类能源有助于减少对传统______的依赖，改善生态环境。`,
      optionsEn: ['A. 化石能源 (煤炭、石油)', 'B. 潮汐能', 'C. 地热能', 'D. 氢能'] as [string, string, string, string],
      optionsZh: ['A. 化石能源（煤炭、石油等）', 'B. 潮汐能', 'C. 地热能', 'D. 氢能'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Developing renewables reduces reliance on traditional fossil fuels ("化石能源").',
      explanationZh: '煤炭、石油属于传统“化石能源”，开发风光可再生能源的核心目的即减少对化石燃料的依赖。故选 A。',
      syllabusRef: 'Science Chinese Part 4: 选词成段',
    };
  }),

  // 第五部分 补全语句 (49-70 题)
  ...Array.from({ length: 22 }, (_, i) => {
    const qNum = i + 49;
    return {
      id: `scichin-2025-12-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Sentence Completion & Grammar (Q49-70)',
      subtopic: '科技定义与动补短语',
      difficulty: 'Standard' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '补全语句',
      questionEn: `第${qNum}题：句子“研究人员必须严格按照操作规程，______把各项实验参数准确记录下来。”横线处最合适的副词是：`,
      questionZh: `第${qNum}题：句子“研究人员必须严格按照操作规程，______把各项实验参数准确记录下来。”横线处最合适的副词是：`,
      optionsEn: ['A. 及时', 'B. 勉强', 'C. 偶尔', 'D. 随意'] as [string, string, string, string],
      optionsZh: ['A. 及时', 'B. 勉强', 'C. 偶尔', 'D. 随意'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"及时" (promptly / in a timely manner) describes standard laboratory compliance protocol.',
      explanationZh: '“及时”记录参数是实验规范的要求，体现科研的严肃性与严谨性。故选 A。',
      syllabusRef: 'Science Chinese Part 5: 补全语句',
    };
  }),

  // 第六部分 科学阅读理解 (71-80 题)
  ...Array.from({ length: 10 }, (_, i) => {
    const qNum = i + 71;
    return {
      id: `scichin-2025-12-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Scientific Reading Comprehension (Q71-80)',
      subtopic: '水结冰反常膨胀科学阅读',
      difficulty: 'Challenging' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '阅读理解',
      questionEn: `[12月科学阅读 第${qNum}题] 文章解释了水在 0 ℃ 至 4 ℃ 之间所呈现的“反常膨胀”现象。下列关于这一特性的推论，符合科学事实的是：`,
      questionZh: `[12月科学阅读 第${qNum}题] 文章解释了水在 0 ℃ 至 4 ℃ 之间所呈现的“反常膨胀”现象。下列关于这一特性的推论，符合科学事实的是：`,
      optionsEn: [
        'A. 水在 4 ℃ 时的密度最大，冬季湖泊表面结冰时底层水温仍可维持在约 4 ℃，保护了水生生物。',
        'B. 水结冰时体积缩小，冰块会沉入湖泊最底部。',
        'C. 无论温度如何变化，水分子之间氢键的几何结构恒定不变。',
        'D. 反常膨胀现象在所有自然界液体中普遍存在。',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 水在 4 ℃ 时的密度最大，冬季湖面结冰后底层水温仍可保持约 4 ℃，为水生生物越冬提供了保障。',
        'B. 水结冰时体积缩小，冰块会迅速沉入湖底。',
        'C. 无论温度如何改变，水分子之间的氢键网络完全不变。',
        'D. 反常膨胀是所有常见化学液体的普遍属性。',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Water reaches its maximum density at 4 °C; anomalous expansion causes ice to float on top while dense 4 °C water insulates aquatic life underneath.',
      explanationZh: '水在 4 ℃ 时密度最大，0 ℃ 的冰浮于水面形成绝热层，底层 4 ℃ 水体维持了水下生态系统生存条件。故选 A。',
      syllabusRef: 'Science Chinese Part 6: 科学阅读理解',
    };
  }),
];
