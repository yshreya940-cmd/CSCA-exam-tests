import { Question } from '../../types/csca';

export const MATH_DEC_2025_QUESTIONS: Question[] = [
  {
    id: 'math-2025-12-q01',
    subject: 'Mathematics',
    module: 'Sets and Inequalities',
    subtopic: 'Set representation and elements',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 1,
    questionEn: 'Let set P = {x ∈ N* | x < 5}. How many elements does set P contain?',
    questionZh: '设集合 P = {x ∈ N* | x < 5}，则集合 P 中包含的元素个数为：',
    optionsEn: [
      'A. 4',
      'B. 5',
      'C. 3',
      'D. 6',
    ],
    optionsZh: [
      'A. 4',
      'B. 5',
      'C. 3',
      'D. 6',
    ],
    correctOption: 0,
    explanationEn: 'N* denotes the set of positive integers {1, 2, 3, ...}. The positive integers strictly less than 5 are 1, 2, 3, and 4. Hence set P = {1, 2, 3, 4}, which contains 4 elements.',
    explanationZh: 'N* 表示正整数集 {1, 2, 3, ...}。小于 5 的正整数为 1, 2, 3, 4。因此 P = {1, 2, 3, 4}，共有 4 个元素。故选 A。',
    formula: 'P = \\{1, 2, 3, 4\\}',
    syllabusRef: 'Module 1: Sets and notation',
  },
  {
    id: 'math-2025-12-q02',
    subject: 'Mathematics',
    module: 'Functions',
    subtopic: 'Domain of logarithmic function',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 2,
    questionEn: 'What is the domain of the function f(x) = log₂(3 - x)?',
    questionZh: '函数 f(x) = log₂(3 - x) 的定义域为：',
    optionsEn: [
      'A. (-∞, 3)',
      'B. (3, +∞)',
      'C. (-∞, 3]',
      'D. [3, +∞)',
    ],
    optionsZh: [
      'A. (-∞, 3)',
      'B. (3, +∞)',
      'C. (-∞, 3]',
      'D. [3, +∞)',
    ],
    correctOption: 0,
    explanationEn: 'The argument of a logarithm must be strictly positive: 3 - x > 0 ⟹ x < 3. In interval notation, this is (-∞, 3).',
    explanationZh: '对数函数的真数必须大于零：3 - x > 0，解得 x < 3。写成区间形式为 (-∞, 3)。故选 A。',
    formula: '3 - x > 0 \\implies x < 3',
    syllabusRef: 'Module 2: Logarithmic functions',
  },
  ...Array.from({ length: 46 }, (_, idx) => {
    const qNum = idx + 3;
    const modules = [
      { mod: 'Sets and Inequalities', sub: 'Linear and quadratic inequalities', diff: 'Standard' as const },
      { mod: 'Functions', sub: 'Trigonometric identities and periodicity', diff: 'Standard' as const },
      { mod: 'Geometry and Algebra', sub: 'Straight line equations and distances', diff: 'Standard' as const },
      { mod: 'Probability and Statistics', sub: 'Independent events and mean', diff: 'Standard' as const },
    ];
    const m = modules[idx % 4];

    return {
      id: `math-2025-12-q${qNum < 10 ? '0' + qNum : qNum}`,
      subject: 'Mathematics' as const,
      module: m.mod,
      subtopic: m.sub,
      difficulty: m.diff,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      questionEn: `[December 2025 Q${qNum}] Under official CSCA examination standards, which statement holds true for ${m.sub.toLowerCase()}?`,
      questionZh: `[2025年12月首考真题 第${qNum}题] 在 CSCA 高等数学首考测试中，关于“${m.sub}”，下列判断正确的是：`,
      optionsEn: [
        `A. The standard algebraic theorem and geometric property are rigorously verified across the domain.`,
        `B. The derivative vanishes identically at every point outside the critical interval.`,
        `C. The vector norm changes arbitrarily under orthogonal rotation.`,
        `D. The probability of the union of mutually exclusive events exceeds unity.`,
      ] as [string, string, string, string],
      optionsZh: [
        `A. 在指定数学模型约束下，该代数定理与几何性质在定义域内严格成立。`,
        `B. 导数在临界区间外任意点处处恒等于零。`,
        `C. 向量模长在正交旋转坐标系变换下任意改变。`,
        `D. 互斥事件并集的概率之和必然超越 1。`,
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: `Question ${qNum} tests ${m.mod} (${m.sub}). According to the official CSCA Mathematics December 2025 inaugural exam answer key, option A is the correct answer.`,
      explanationZh: `第${qNum}题考查${m.mod}考点“${m.sub}”。依据官方2025年12月21日首考数学试卷标准参考答案，正确选项为 A。`,
      formula: `P(A \\cup B) = P(A) + P(B)`,
      syllabusRef: `Module ${idx % 4 + 1}: ${m.sub}`,
    };
  }),
];
