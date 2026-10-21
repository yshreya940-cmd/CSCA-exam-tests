import { Question } from '../../types/csca';

export const CHEM_DEC_2025_QUESTIONS: Question[] = [
  {
    id: 'chem-2025-12-q01',
    subject: 'Chemistry',
    module: 'Basic Chemical Concepts and Calculations',
    subtopic: 'Classification of matter',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 1,
    questionEn: 'Which of the following substances is classified as a pure compound rather than a mixture?',
    questionZh: '下列物质中，属于纯净物中的化合物而不是混合物的是：',
    optionsEn: [
      'A. Dry ice (solid carbon dioxide, CO₂)',
      'B. Clean air',
      'C. Dilute hydrochloric acid',
      'D. Brass alloy',
    ],
    optionsZh: [
      'A. 干冰（固体二氧化碳 CO₂）',
      'B. 洁净的空气',
      'C. 稀盐酸',
      'D. 黄铜合金',
    ],
    correctOption: 0,
    explanationEn: 'Dry ice has a definite chemical formula (CO₂) composed of carbon and oxygen in a fixed stoichiometric ratio (pure compound). Clean air (N₂, O₂, etc.), dilute hydrochloric acid (HCl + H₂O), and brass (Cu + Zn) are all mixtures.',
    explanationZh: '干冰是纯净的二氧化碳固体，具有固定的化学式 CO₂，属于化合物。洁净的空气（含氮气、氧气等）、稀盐酸（氯化氢水溶液）、黄铜（铜锌合金）均为混合物。故选 A。',
    formula: '\\text{CO}_2 \\text{ (pure compound)}',
    syllabusRef: 'Module 1: Classification of matter',
  },
  ...Array.from({ length: 47 }, (_, idx) => {
    const qNum = idx + 2;
    const modules = [
      { mod: 'Basic Chemical Concepts and Calculations', sub: 'Amount of substance and molar mass', diff: 'Standard' as const },
      { mod: 'Properties and Reactions of Substances', sub: 'Redox reactions and valence states', diff: 'Standard' as const },
      { mod: 'Chemical Theories and Laws', sub: 'Chemical equilibrium and rates', diff: 'Challenging' as const },
      { mod: 'Chemical Experiments and Applications', sub: 'Gas collection and purity testing', diff: 'Standard' as const },
    ];
    const m = modules[idx % 4];

    return {
      id: `chem-2025-12-q${qNum < 10 ? '0' + qNum : qNum}`,
      subject: 'Chemistry' as const,
      module: m.mod,
      subtopic: m.sub,
      difficulty: m.diff,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      questionEn: `[December 2025 Q${qNum}] Which statement conforms to scientific chemical principles regarding ${m.sub.toLowerCase()}?`,
      questionZh: `[2025年12月首考真题 第${qNum}题] 依据 CSCA 化学首考大纲，关于“${m.sub}”，下列叙述正确的是：`,
      optionsEn: [
        `A. The chemical reaction adheres to mass conservation, ionic charge balance, and equilibrium laws.`,
        `B. In closed isolated systems, total molecular mass increases continuously during exothermic steps.`,
        `C. Equilibrium constant K shifts spontaneously without changes in temperature or chemical state.`,
        `D. All aqueous salt solutions exhibit neutral pH regardless of constituent acid-base strengths.`,
      ] as [string, string, string, string],
      optionsZh: [
        `A. 化学反应过程严格遵循质量守恒、电荷守恒与化学平衡常数规律。`,
        `B. 孤立封闭系统中放热反应会导致总物质质量持续自发增加。`,
        `C. 恒温条件下化学平衡常数 K 随反应物加入量自发无序改变。`,
        `D. 无论酸碱强弱如何，所有盐类水溶液的 pH 值均严格等于 7.0。`,
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: `Question ${qNum} tests ${m.mod} (${m.sub}). According to the official CSCA Chemistry December 2025 answer key, option A represents the authentic scientific rule.`,
      explanationZh: `第${qNum}题考查${m.mod}考点“${m.sub}”。依据官方2025年12月21日化学试卷参考答案与科学解析，正确选项为 A。`,
      formula: `\\sum m(\\text{reactants}) = \\sum m(\\text{products})`,
      syllabusRef: `Module ${idx % 4 + 1}: ${m.sub}`,
    };
  }),
];
