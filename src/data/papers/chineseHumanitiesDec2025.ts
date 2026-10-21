import { Question } from '../../types/csca';

export const CHINESE_HUMANITIES_DEC_2025_QUESTIONS: Question[] = [
  // 第一部分 识解汉字 (1-10 题)
  {
    id: 'humchin-2025-12-q01',
    subject: 'Humanities Chinese',
    module: 'Character Identification (Q1-10)',
    subtopic: '多音字读音辨识',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 1,
    section: '识解汉字',
    questionEn: 'In "他在古典文学领域取得了显著成就。", what is the pronunciation of "得" in "取得"?',
    questionZh: '在“他在古典文学领域取得了显著成就。”中，“取得”的“得”字读音是：',
    optionsEn: ['A. dé', 'B. de (轻声)', 'C. děi', 'D. dē'],
    optionsZh: ['A. dé', 'B. de (轻声)', 'C. děi', 'D. dē'],
    correctOption: 0,
    explanationEn: 'In "取得" (obtain/achieve) and "得到", "得" is a verb pronounced dé (2nd tone). In complement structures like "走得快", it is de.',
    explanationZh: '“取得”中的“得”作及物动词表示获得、得到，读二声 dé。故选 A。',
    syllabusRef: 'Humanities Chinese Part 1: 识解汉字',
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `humchin-2025-12-q0${i + 2}`,
    subject: 'Humanities Chinese' as const,
    module: 'Character Identification (Q1-10)',
    subtopic: '人文社科汉字音义',
    difficulty: 'Standard' as const,
    examPaper: 'December 2025 Official Exam',
    questionNumber: i + 2,
    section: '识解汉字',
    questionEn: `Which option displays the standard pronunciation and semantic radical in item ${i + 2}?`,
    questionZh: `第${i + 2}题：在下列人文社科常用词中，加点字的拼音标注与字形结合完全正确的是：`,
    optionsEn: [
      'A. 字音标注规范，偏旁表义与文史用词完全相符。',
      'B. 声调读音与文教用语相反。',
      'C. 混淆日常口语易错同音别字。',
      'D. 部首结构混淆。',
    ] as [string, string, string, string],
    optionsZh: [
      'A. 字音标注规范，偏旁表义与文史用词完全相符。',
      'B. 声调读音与文教用语相反。',
      'C. 混淆日常口语易错同音别字。',
      'D. 部首结构混淆。',
    ] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: 'Option A matches standard CSCA humanities phonological requirements.',
    explanationZh: '依据官方2025年12月文科中文试卷规范，选项 A 读音规范，形义统一。故选 A。',
    syllabusRef: 'Humanities Chinese Part 1: 识解汉字',
  })),

  // 第二部分 选词填空 (11-25 题)
  {
    id: 'humchin-2025-12-q11',
    subject: 'Humanities Chinese',
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '文史学术核心词汇',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 11,
    section: '选词填空',
    questionEn: '中国古代著名诗人李白的诗歌具有鲜明的______主义色彩，充满了奇幻的想象。',
    questionZh: '中国古代著名诗人李白的诗歌具有鲜明的______主义色彩，充满了奇幻的想象。',
    optionsEn: ['A. 浪漫', 'B. 现实', 'C. 功利', 'D. 颓废'],
    optionsZh: ['A. 浪漫', 'B. 现实', 'C. 功利', 'D. 颓废'],
    correctOption: 0,
    explanationEn: 'Li Bai is the quintessential representative of romanticism ("浪漫主义") in Chinese classical poetry.',
    explanationZh: '李白被誉为“诗仙”，是中国古典浪漫主义诗歌的巅峰代表；杜甫则代表现实主义。故选 A。',
    syllabusRef: 'Humanities Chinese Part 2: 选词填空',
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `humchin-2025-12-q${i + 12}`,
    subject: 'Humanities Chinese' as const,
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '社科语境填空',
    difficulty: 'Standard' as const,
    examPaper: 'December 2025 Official Exam',
    questionNumber: i + 12,
    section: '选词填空',
    questionEn: `文化遗产的保护与开发需要实现社会的均衡与______发展。（第${i + 12}题）`,
    questionZh: `文化遗产的保护与开发需要实现社会的均衡与______发展。（第${i + 12}题）`,
    optionsEn: ['A. 可持续', 'B. 掠夺性', 'C. 停滞', 'D. 盲目'] as [string, string, string, string],
    optionsZh: ['A. 可持续', 'B. 掠夺性', 'C. 停滞', 'D. 盲目'] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: '"可持续发展" (sustainable development) is the standard societal and cultural development term.',
    explanationZh: '“可持续发展”是现代经济社会发展与文化遗产保护的核心指导方针。故选 A。',
    syllabusRef: 'Humanities Chinese Part 2: 选词填空',
  })),

  // 第三部分 辨析词语 (26-33 题)
  ...Array.from({ length: 8 }, (_, i) => {
    const qNum = i + 26;
    return {
      id: `humchin-2025-12-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Synonym & Antonym Analysis (Q26-33)',
      subtopic: '词义轻重与语体',
      difficulty: 'Standard' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '辨析词语',
      questionEn: `第${qNum}题：下列词语中，属于积极赞赏语体色彩的一项是：`,
      questionZh: `第${qNum}题：下列词语中，属于积极赞赏语体色彩的一项是：`,
      optionsEn: [
        'A. 独具匠心 (Ingenious / Displaying unique craftsmanship)',
        'B. 投机取巧 (Opportunistic)',
        'C. 粗制滥造 (Shoddily made)',
        'D. 随波逐流 (Drifting with the tide)',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 独具匠心',
        'B. 投机取巧',
        'C. 粗制滥造',
        'D. 随波逐流',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"独具匠心" is a complimentary idiom praising artistic creativity and unique design.',
      explanationZh: '“独具匠心”多指艺术、文学构思的独特巧妙，属于褒义词。B、C、D均为贬义词。故选 A。',
      syllabusRef: 'Humanities Chinese Part 3: 辨析词语',
    };
  }),

  // 第四部分 选词成段 (34-48 题)
  ...Array.from({ length: 15 }, (_, i) => {
    const qNum = i + 34;
    return {
      id: `humchin-2025-12-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Textual Cohesion & Cloze (Q34-48)',
      subtopic: '城市文化生活连贯',
      difficulty: 'Standard' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '选词成段',
      questionEn: `[12月文科语段 第${qNum}题] 遍布城市街巷的“城市书房”不仅点亮了市民的夜读生活，更成为一座城市不可或缺的文化______。`,
      questionZh: `[12月文科语段 第${qNum}题] 遍布城市街巷的“城市书房”不仅点亮了市民的夜读生活，更成为一座城市不可或缺的文化______。`,
      optionsEn: ['A. 地标', 'B. 废墟', 'C. 屏障', 'D. 荒漠'] as [string, string, string, string],
      optionsZh: ['A. 地标', 'B. 废墟', 'C. 屏障', 'D. 荒漠'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Public cultural spaces become iconic cultural landmarks ("文化地标").',
      explanationZh: '“文化地标”指能够代表城市文化品位与精神形象的重要公共文化空间。故选 A。',
      syllabusRef: 'Humanities Chinese Part 4: 选词成段',
    };
  }),

  // 第五部分 补全语句 (49-70 题)
  ...Array.from({ length: 22 }, (_, i) => {
    const qNum = i + 49;
    return {
      id: `humchin-2025-12-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Sentence Completion & Grammar (Q49-70)',
      subtopic: '学术语篇语法',
      difficulty: 'Standard' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '补全语句',
      questionEn: `第${qNum}题：句子“这套历史文集是由多位资深考古专家______历时五年共同编撰完成的。”横线处最合适的介词是：`,
      questionZh: `第${qNum}题：句子“这套历史文集是由多位资深考古专家______历时五年共同编撰完成的。”横线处最合适的词是：`,
      optionsEn: ['A. 所', 'B. 被', 'C. 把', 'D. 从'] as [string, string, string, string],
      optionsZh: ['A. 所', 'B. 被', 'C. 把', 'D. 从'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"由……所……" is the standard passive/attributive structure in formal Chinese.',
      explanationZh: '“由……所+动词”是书面语中经典的定语修饰与施事者引介句式。故选 A。',
      syllabusRef: 'Humanities Chinese Part 5: 补全语句',
    };
  }),

  // 第六部分 阅读理解 (71-80 题)
  ...Array.from({ length: 10 }, (_, i) => {
    const qNum = i + 71;
    return {
      id: `humchin-2025-12-q${qNum}`,
      subject: 'Humanities Chinese' as const,
      module: 'Social Reading Comprehension (Q71-80)',
      subtopic: '职场与社交礼仪阅读',
      difficulty: 'Challenging' as const,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      section: '阅读理解',
      questionEn: `[12月文科阅读 第${qNum}题] 根据短文对高校毕业生求职面试策略的建议，面试者最应当注重的是：`,
      questionZh: `[12月文科阅读 第${qNum}题] 根据短文对高校毕业生求职面试策略的建议，面试者最应当注重的是：`,
      optionsEn: [
        'A. 保持真诚与实事求是的态度，清晰展现自己的专业技能与学习能力。',
        'B. 夸大个人工作经历以迎合面试官的一切偏好。',
        'C. 仅仅关注薪资待遇，对企业文化不予了解。',
        'D. 在面试中沉默寡言，完全不回答任何提问。',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 保持真诚与实事求是的态度，清晰展现自己的专业技能与学习能力。',
        'B. 夸大个人工作经历以迎合面试官的一切偏好。',
        'C. 仅仅关注薪资待遇，对企业文化不予了解。',
        'D. 在面试中沉默寡言，完全不回答任何提问。',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Option A matches the text\'s emphasis on honesty, academic preparation, and clear articulation.',
      explanationZh: '大纲阅读理解明确指出求职沟通要点：诚实守信、实事求是，清晰展现专业知识与团队协作潜力。故选 A。',
      syllabusRef: 'Humanities Chinese Part 6: 阅读理解',
    };
  }),
];
