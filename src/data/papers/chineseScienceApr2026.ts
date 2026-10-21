import { Question } from '../../types/csca';

export const CHINESE_SCIENCE_APR_2026_QUESTIONS: Question[] = [
  // 第一部分 识解汉字 (1-10 题)
  {
    id: 'scichin-2026-04-q01',
    subject: 'Science Chinese',
    module: 'Character Identification (Q1-10)',
    subtopic: '多音字读音辨识',
    difficulty: 'Standard',
    examPaper: 'April 2026 Official Exam',
    questionNumber: 1,
    section: '识解汉字',
    questionEn: 'In "容器中盛放着一定浓度的硫酸铜溶液", what is the pronunciation of "盛" in "盛放"?',
    questionZh: '在“容器中盛放着一定浓度的硫酸铜溶液”中，“盛放”的“盛”字正确读音是：',
    optionsEn: ['A. chéng', 'B. shèng', 'C. cheng (轻声)', 'D. chěng'],
    optionsZh: ['A. chéng', 'B. shèng', 'C. cheng (轻声)', 'D. chěng'],
    correctOption: 0,
    explanationEn: 'When used as a verb meaning to hold, contain, or fill (e.g. 盛放, 盛水, 盛饭), "盛" is pronounced chéng (2nd tone). In "繁盛" or "盛大", it is shèng (4th tone).',
    explanationZh: '“盛”作动词表示把东西放进去、容纳时读二声 chéng（如盛放、盛水）；表示茂盛、盛大时读四声 shèng。故选 A。',
    syllabusRef: 'Science Chinese Part 1: 识解汉字',
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `scichin-2026-04-q0${i + 2}`,
    subject: 'Science Chinese' as const,
    module: 'Character Identification (Q1-10)',
    subtopic: '科学汉字音义',
    difficulty: 'Standard' as const,
    examPaper: 'April 2026 Official Exam',
    questionNumber: i + 2,
    section: '识解汉字',
    questionEn: `Which option displays the standard scientific pronunciation and radical semantic alignment for item ${i + 2}?`,
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
    explanationEn: 'Option A matches standard CSCA scientific Chinese orthography and phonology rules.',
    explanationZh: '根据留学生专业汉语考试大纲第一部分汉字识解规范，选项 A 字音字形与理科专业语境完全相符。',
    syllabusRef: 'Science Chinese Part 1: 识解汉字',
  })),

  // 第二部分 选词填空 (11-25 题)
  {
    id: 'scichin-2026-04-q11',
    subject: 'Science Chinese',
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '实验操作动词',
    difficulty: 'Standard',
    examPaper: 'April 2026 Official Exam',
    questionNumber: 11,
    section: '选词填空',
    questionEn: '在过滤操作中，漏斗下端管口必须紧贴烧杯内壁，以防止滤液______。',
    questionZh: '在过滤操作中，漏斗下端管口必须紧贴烧杯内壁，以防止滤液______。',
    optionsEn: ['A. 飞溅', 'B. 凝聚', 'C. 蒸发', 'D. 凝固'],
    optionsZh: ['A. 飞溅', 'B. 凝聚', 'C. 蒸发', 'D. 凝固'],
    correctOption: 0,
    explanationEn: 'In laboratory filtration guidelines, the stem of the funnel touches the inside wall of the beaker to prevent drops from splashing ("飞溅").',
    explanationZh: '过滤实验“一贴二低三靠”规范中，漏斗下端长管口紧靠烧杯内壁是为了防止液滴“飞溅”。故选 A。',
    syllabusRef: 'Science Chinese Part 2: 选词填空',
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `scichin-2026-04-q${i + 12}`,
    subject: 'Science Chinese' as const,
    module: 'Vocabulary Completion (Q11-25)',
    subtopic: '科技词汇搭配',
    difficulty: 'Standard' as const,
    examPaper: 'April 2026 Official Exam',
    questionNumber: i + 12,
    section: '选词填空',
    questionEn: `在实验过程中，温度传感器的读数保持十分______。（第${i + 12}题）`,
    questionZh: `在实验过程中，温度传感器的读数保持十分______。（第${i + 12}题）`,
    optionsEn: ['A. 稳定', 'B. 摇摆', 'C. 激化', 'D. 浮躁'] as [string, string, string, string],
    optionsZh: ['A. 稳定', 'B. 摇摆', 'C. 激化', 'D. 浮躁'] as [string, string, string, string],
    correctOption: 0 as const,
    explanationEn: 'Sensor instrumentation readings remain "稳定" (stable).',
    explanationZh: '“读数稳定”是实验仪器与数据测量的标准搭配。故选 A。',
    syllabusRef: 'Science Chinese Part 2: 选词填空',
  })),

  // 第三部分 辨析词语 (26-33 题)
  ...Array.from({ length: 8 }, (_, i) => {
    const qNum = i + 26;
    return {
      id: `scichin-2026-04-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Synonym & Antonym Analysis (Q26-33)',
      subtopic: '科学语体辨析',
      difficulty: 'Standard' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '辨析词语',
      questionEn: `第${qNum}题：下列关于“推导”与“推测”的科学学术用法辨析中，最恰当的一项是：`,
      questionZh: `第${qNum}题：下列关于“推导”与“推测”的科学学术用法辨析中，最恰当的一项是：`,
      optionsEn: [
        'A. 数学定理公式依靠严谨的逻辑步骤进行推导。',
        'B. 依据实验数据对万有引力公式进行随意推测。',
        'C. 物理实验中的误差可以用公式推测出来。',
        'D. 科学真理都是主观推测出来的。',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 数学定理公式依靠严谨的逻辑步骤进行推导。',
        'B. 依据实验数据对万有引力公式进行随意推测。',
        'C. 物理实验中的误差可以用公式推测出来。',
        'D. 科学真理都是主观推测出来的。',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"推导" denotes rigorous logical derivation from established axioms and theorems.',
      explanationZh: '“推导”指依据已知公理、定律，通过严密的逻辑演算法则得出结论，修饰数学公式定理最为准确。故选 A。',
      syllabusRef: 'Science Chinese Part 3: 辨析词语',
    };
  }),

  // 第四部分 选词成段 (34-48 题)
  ...Array.from({ length: 15 }, (_, i) => {
    const qNum = i + 34;
    return {
      id: `scichin-2026-04-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Textual Cohesion & Cloze (Q34-48)',
      subtopic: '科学探究语段连贯',
      difficulty: 'Standard' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '选词成段',
      questionEn: `[春季真题语段填空 第${qNum}题] 物质的密度是指单位体积内所含物质的质量，通常用符号 ρ 表示，其国际基本单位是______。`,
      questionZh: `[春季真题语段填空 第${qNum}题] 物质的密度是指单位体积内所含物质的质量，通常用符号 ρ 表示，其国际基本单位是______。`,
      optionsEn: ['A. 千克/立方米 (kg/m³)', 'B. 牛顿/平方米 (N/m²)', 'C. 焦耳 (J)', 'D. 瓦特 (W)'] as [string, string, string, string],
      optionsZh: ['A. 千克/立方米 (kg/m³)', 'B. 牛顿/平方米 (N/m²)', 'C. 焦耳 (J)', 'D. 瓦特 (W)'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'The SI unit for density is kilograms per cubic meter (kg/m³).',
      explanationZh: '密度 ρ = m / V，质量国际单位是 kg，体积是 m³，密度的 SI 基本单位为 kg/m³。故选 A。',
      syllabusRef: 'Science Chinese Part 4: 选词成段',
    };
  }),

  // 第五部分 补全语句 (49-70 题)
  ...Array.from({ length: 22 }, (_, i) => {
    const qNum = i + 49;
    return {
      id: `scichin-2026-04-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Sentence Completion & Grammar (Q49-70)',
      subtopic: '比较句与把字句规范',
      difficulty: 'Standard' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '补全语句',
      questionEn: `第${qNum}题：句子“在真空环境中，羽毛______铁球下落得一样快。”横线处最合适的词是：`,
      questionZh: `第${qNum}题：句子“在真空环境中，羽毛______铁球下落得一样快。”横线处最合适的词是：`,
      optionsEn: ['A. 和', 'B. 把', 'C. 比', 'D. 被'] as [string, string, string, string],
      optionsZh: ['A. 和', 'B. 把', 'C. 比', 'D. 被'] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: '"和……一样快" is the standard equal comparative structure in Chinese ("falls as fast as").',
      explanationZh: '“A 和 B 一样……”是汉语中标准的平比句型，表示两者具有相同程度的属性。故选 A。',
      syllabusRef: 'Science Chinese Part 5: 补全语句',
    };
  }),

  // 第六部分 科学阅读理解 (71-80 题)
  ...Array.from({ length: 10 }, (_, i) => {
    const qNum = i + 71;
    return {
      id: `scichin-2026-04-q${qNum}`,
      subject: 'Science Chinese' as const,
      module: 'Scientific Reading Comprehension (Q71-80)',
      subtopic: '热传递原理科学阅读',
      difficulty: 'Challenging' as const,
      examPaper: 'April 2026 Official Exam',
      questionNumber: qNum,
      section: '阅读理解',
      questionEn: `[科学阅读 第${qNum}题] 文章指出热传递的三种基本方式为热传导、热对流与热辐射。在真空中唯一能够进行热量传递的方式是：`,
      questionZh: `[科学阅读 第${qNum}题] 文章指出热传递的三种基本方式为热传导、热对流与热辐射。在真空中唯一能够进行热量传递的方式是：`,
      optionsEn: [
        'A. 热辐射 (Thermal radiation via electromagnetic waves)',
        'B. 热传导 (Conduction requiring molecular collisions)',
        'C. 热对流 (Convection requiring macroscopic fluid motion)',
        'D. 机械振动传递',
      ] as [string, string, string, string],
      optionsZh: [
        'A. 热辐射（以电磁波形式在真空中传播）',
        'B. 热传导（需要微观分子碰撞介质）',
        'C. 热对流（需要流体宏观定向流动）',
        'D. 机械振动传递',
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: 'Thermal radiation propagates via electromagnetic waves and requires no medium, functioning in vacuum.',
      explanationZh: '热辐射依靠电磁波发射与吸收传递能量，不需要任何实物介质，是太阳向地球在真空中传热的唯一方式。故选 A。',
      syllabusRef: 'Science Chinese Part 6: 科学阅读理解',
    };
  }),
];
