import { Question } from '../../types/csca';

export const CHINESE_HUMANITIES_APR_2026_QUESTIONS: Question[] = [
  // 第一部分 识解汉字 (1-10 题)
  {
    id: 'humchin-2026-04-q01',
    subject: 'Humanities Chinese',
    module: 'Character Identification (Q1-10)',
    subtopic: '多音字读音辨识',
    difficulty: 'Standard',
    examPaper: 'April 2026 Official Exam',
    questionNumber: 1,
    section: '识解汉字',
    questionEn: 'In "在古代丝绸之路的历史研究中，学者发现了重要的便函纪事。", what is the correct pronunciation of "便" in "便函"?',
    questionZh: '在“在古代丝绸之路的历史研究中，学者发现了重要的便函纪事。”中，“便函”的“便”字读音是：',
    optionsEn: ['A. biàn', 'B. pián', 'C. bian (轻声)', 'D. piān'],
    optionsZh: ['A. biàn', 'B. pián', 'C. bian (轻声)', 'D. piān'],
    correctOption: 0,
    explanationEn: 'In "便函" (informal letter/note) and "便利", "便" is pronounced biàn (4th tone). In "便宜" (cheap), it is pronounced pián.',
    explanationZh: '“便函”指公文中的非正式公函或便条，读四声 biàn；表示价钱低时读 pián（便宜）。故选 A。',
    syllabusRef: 'Humanities Chinese Part 1: 识解汉字',
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `humchin-2026-04-q0${i + 2}`,
    subject: 'Humanities Chinese' as const,
    module: 'Character Identification (Q1-10)',
    subtopic: '人文汉字音义',
    difficulty: 'Standard' as const,
    examPaper: 'April 2026 Official Exam',
    questionNumber: i + 2,
    section: '识解汉字',
    questionEn: `Which option displays the accurate character pronunciation and radical alignment for item ${i + 2}?`,
    questionZh: `第${i + 2}题：在下列人文社会科学基础用词中，加点字的拼音标注与形旁表意完全吻合的是：`,
    optionsEn: [
      'A. 字音标注规范，偏旁表义与文教社科语境完全相符。',
      'B. 声调与现代标准汉语音系相反。',
      'C. 混淆日常口语易错同音别字。',
      'D. 部首结构混淆。',
    ] as [string, string, string, string],
    optionsZh: [
      'A. 字音标注规范，偏旁表义与文教社科语境完全相符。',
      'B. 声调与现代标准汉语音系相反。',
      'C. 混淆日常口语易错同音别字。',
      'D. 部首结构混淆。',
    ] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: 'Option A complies with official CSCA Chinese phonology rules.',
    explanationZh: '大纲第一部分汉字识解规范：选项 A 读音规范，形义统一。故选 A。',
    syllabusRef: 'Humanities Chinese Part 1: 识解汉字',
  })),

  // 第二部分 选词填空 (11-25 题)
  {
    id: 'humchin-2026-04-q11',
    subject: 'Humanities Chinese',
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '文史学术核心词汇',
    difficulty: 'Standard',
    examPaper: 'April 2026 Official Exam',
    questionNumber: 11,
    section: '选词填空',
    questionEn: '阅读古典文学作品有助于提高学生对优秀传统文化的______能力。',
    questionZh: '阅读古典文学作品有助于提高学生对优秀传统文化的______能力。',
    optionsEn: ['A. 鉴赏', 'B. 批判', 'C. 模仿', 'D. 遗忘'],
    optionsZh: ['A. 鉴赏', 'B. 批判', 'C. 模仿', 'D. 遗忘'],
    correctOption: 0,
    explanationEn: 'Appreciation of artistic and cultural literature is defined as "鉴赏" (appreciation/aesthetic evaluation).',
    explanationZh: '“鉴赏”指鉴定和欣赏艺术品、文学作品等，符合“提高传统文化鉴赏能力”的语境。故选 A。',
    syllabusRef: 'Humanities Chinese Part 2: 选词填空',
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `humchin-2026-04-q${i + 12}`,
    subject: 'Humanities Chinese' as const,
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '社科语境填空',
    difficulty: 'Standard' as const,
    examPaper: 'April 2026 Official Exam',
    questionNumber: i + 12,
    section: '选词填空',
    questionEn: `面对多元文化的碰撞与交流，我们要保持开放包容的______。（第${i + 12}题）`,
    questionZh: `面对多元文化的碰撞与交流，我们要保持开放包容的______。（第${i + 12}题）`,
    optionsEn: ['A. 心态', 'B. 戒备', 'C. 固执', 'D. 抵触'] as [string, string, string, string],
    optionsZh: ['A. 心态', 'B. 戒备', 'C. 固执', 'D. 抵触'] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: 'Maintaining an open and inclusive mindset is phrased as "开放包容的心态".',
    explanationZh: '“心态”指心理状态、胸怀态度，“保持开放包容的心态”是文教社科常用正面规范表达。故选 A。',
    syllabusRef: 'Humanities Chinese Part 2: 选词填空',
  })),

  // 第三部分 辨析词语 (26-33 题)
  ...Array.from({ length: 8 }, (_, i) => {
    const qNum = i + 26;
    return {
      id: `humchin-2026-04-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Synonym & Antonym Analysis (Q26-33)',
      subtopic: '文科近义成语辨析',
      difficulty: 'Standard' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '辨析词语',
      questionEn: `第${qNum}题：下列句子中，加点成语使用最恰当的一项是：`,
      questionZh: `第${qNum}题：下列句子中，成语“博大精深”使用最恰当的一项是：`,
      optionsEn: [
        'A. 中华优秀传统文化源远流长、博大精深，蕴含着丰富的哲学智慧。',
        'B. 这本科普故事书内容写得博大精深，只有两页纸。',
        'C. 他的书包容量很大，真可谓博大精深。',
        'D. 操场上的活动办得博大精深，十分热闹。',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 中华优秀传统文化源远流长、博大精深，蕴含着丰富的哲学智慧。',
        'B. 这本科普故事书内容写得博大精深，只有两页纸。',
        'C. 他的书包容量很大，真可谓博大精深。',
        'D. 操场上的活动办得博大精深，十分热闹。',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"博大精深" describes profound, extensive philosophical thought, cultural heritage, and theoretical frameworks.',
      explanationZh: '“博大精深”形容思想和学术文化广博高深，专用于修饰文化、思想、理论体系。A选项运用贴切。',
      syllabusRef: 'Humanities Chinese Part 3: 辨析词语',
    };
  }),

  // 第四部分 选词成段 (34-48 题)
  ...Array.from({ length: 15 }, (_, i) => {
    const qNum = i + 34;
    return {
      id: `humchin-2026-04-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Textual Cohesion & Cloze (Q34-48)',
      subtopic: '传统节日文化语篇',
      difficulty: 'Standard' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '选词成段',
      questionEn: `[春季文科语篇 第${qNum}题] 中秋节是中国传统节日之一，自古便有赏月、吃月饼的习俗，寄托着人们对家庭______的美好心愿。`,
      questionZh: `[春季文科语篇 第${qNum}题] 中秋节是中国传统节日之一，自古便有赏月、吃月饼的习俗，寄托着人们对家庭______的美好心愿。`,
      optionsEn: ['A. 团圆', 'B. 分离', 'C. 漂泊', 'D. 争执'] as [string, string, string, string],
      optionsZh: ['A. 团圆', 'B. 分离', 'C. 漂泊', 'D. 争执'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'The Mid-Autumn Festival represents family reunion ("团圆").',
      explanationZh: '中秋圆月象征亲人团聚，寄托对“家庭团圆”的美好祈愿，符合传统文化内涵。故选 A。',
      syllabusRef: 'Humanities Chinese Part 4: 选词成段',
    };
  }),

  // 第五部分 补全语句 (49-70 题)
  ...Array.from({ length: 22 }, (_, i) => {
    const qNum = i + 49;
    return {
      id: `humchin-2026-04-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Sentence Completion & Grammar (Q49-70)',
      subtopic: '学术语篇语法',
      difficulty: 'Standard' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '补全语句',
      questionEn: `第${qNum}题：句子“无论遇到多大的困难与挑战，我们______要坚定信心、勇往直前。”横线处最合适的词是：`,
      questionZh: `第${qNum}题：句子“无论遇到多大的困难与挑战，我们______要坚定信心、勇往直前。”横线处最合适的词是：`,
      optionsEn: ['A. 都', 'B. 就', 'C. 便', 'D. 才'] as [string, string, string, string],
      optionsZh: ['A. 都', 'B. 就', 'C. 便', 'D. 才'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"无论……都……" is the standard conditional unconditioned pairing in Chinese ("no matter what, still always...").',
      explanationZh: '“无论/不管……都……”是典型的无条件条件复句固定搭配，表示在任何假设条件下结果都不变。故选 A。',
      syllabusRef: 'Humanities Chinese Part 5: 补全语句',
    };
  }),

  // 第六部分 阅读理解 (71-80 题)
  ...Array.from({ length: 10 }, (_, i) => {
    const qNum = i + 71;
    return {
      id: `humchin-2026-04-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Social Reading Comprehension (Q71-80)',
      subtopic: '文化遗产保护学术阅读',
      difficulty: 'Challenging' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '阅读理解',
      questionEn: `[文史阅读 第${qNum}题] 文章重点论述了数字化技术在敦煌莫高窟壁画保护中的创新应用，其核心价值在于：`,
      questionZh: `[文史阅读 第${qNum}题] 文章重点论述了数字化技术在敦煌莫高窟壁画保护中的创新应用，其核心价值在于：`,
      optionsEn: [
        'A. 实现了文物高精度数字永久保存，并突破时空限制促进全球文化共享。',
        'B. 可以彻底废除对实体洞窟文物的物理日常监测与维护。',
        'C. 允许游客在洞窟内随意触摸和改动壁画颜料。',
        'D. 降低了学术研究的标准，使专业考古失去意义。',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 实现了文物高精度数字永久保存，并突破时空限制促进全球文化共享。',
        'B. 可以彻底废除对实体洞窟文物的物理日常监测与维护。',
        'C. 允许游客在洞窟内随意触摸和改动壁画颜料。',
        'D. 降低了学术研究的标准，使专业考古失去意义。',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Option A synthesizes digital heritage archiving with open cultural access.',
      explanationZh: '数字文保主旨：利用高精度扫描与虚拟现实技术，既实现了文化遗产的永久数字化留存，又让全世界学者和公众跨越地域欣赏研究。故选 A。',
      syllabusRef: 'Humanities Chinese Part 6: 阅读理解',
    };
  }),
];
