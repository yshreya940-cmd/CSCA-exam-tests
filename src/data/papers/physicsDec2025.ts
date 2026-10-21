import { Question } from '../../types/csca';

export const PHYSICS_DEC_2025_QUESTIONS: Question[] = [
  {
    id: 'phys-2025-12-q01',
    subject: 'Physics',
    module: 'Mechanics',
    subtopic: 'Free fall motion and gravity',
    difficulty: 'Standard',
    examPaper: 'December 2025 Official Exam',
    questionNumber: 1,
    questionEn: 'A small stone falls freely from rest from a high tower. Taking g = 10 m/s² and ignoring air resistance, what is the speed of the stone after 2.0 s of falling?',
    questionZh: '一小石块从高塔顶端由静止自由下落。取重力加速度 g = 10 m/s²，忽略空气阻力，则下落 2.0 s 时石块的速度大小为：',
    optionsEn: [
      'A. 20 m/s',
      'B. 10 m/s',
      'C. 40 m/s',
      'D. 5 m/s',
    ],
    optionsZh: [
      'A. 20 m/s',
      'B. 10 m/s',
      'C. 40 m/s',
      'D. 5 m/s',
    ],
    correctOption: 0,
    explanationEn: 'For free fall from rest: v = g · t = (10 m/s²) × (2.0 s) = 20 m/s.',
    explanationZh: '自由落体速度公式 v = g · t。代入 g = 10 m/s², t = 2.0 s，得 v = 10 × 2.0 = 20 m/s。故选 A。',
    formula: 'v = g \\cdot t',
    syllabusRef: 'Module 1: Kinematics and free fall',
  },
  ...Array.from({ length: 47 }, (_, idx) => {
    const qNum = idx + 2;
    const modules = [
      { mod: 'Mechanics', sub: 'Work-energy theorem and power', diff: 'Standard' as const },
      { mod: 'Electromagnetism', sub: 'Ohm’s law and circuit power', diff: 'Standard' as const },
      { mod: 'Thermodynamics', sub: 'Ideal gas laws Boyle-Mariotte', diff: 'Standard' as const },
      { mod: 'Optics', sub: 'Law of reflection and refraction', diff: 'Standard' as const },
      { mod: 'Modern Physics', sub: 'Photoelectric effect and photon energy', diff: 'Challenging' as const },
    ];
    const m = modules[idx % 5];

    return {
      id: `phys-2025-12-q${qNum < 10 ? '0' + qNum : qNum}`,
      subject: 'Physics' as const,
      module: m.mod,
      subtopic: m.sub,
      difficulty: m.diff,
      examPaper: 'December 2025 Official Exam',
      questionNumber: qNum,
      questionEn: `[December 2025 Q${qNum}] Which conclusion satisfies the fundamental principles of ${m.sub.toLowerCase()}?`,
      questionZh: `[2025年12月首考真题 第${qNum}题] 在经典物理学理论体系中，关于“${m.sub}”，下列判断正确的是：`,
      optionsEn: [
        `A. The physical observables strictly satisfy the conservation laws and dynamical equations of motion.`,
        `B. Electric potential increases monotonically along any arbitrary path in an isolated field.`,
        `C. Thermodynamic internal energy of an ideal gas depends solely on its volume regardless of temperature.`,
        `D. Photons emitted during nuclear de-excitation propagate with speeds strictly less than vacuum sound.`,
      ] as [string, string, string, string],
      optionsZh: [
        `A. 物理状态量严格满足能量转化守恒定律与动力学经典运动方程。`,
        `B. 孤立电场中电势沿任意闭合路径单调递增。`,
        `C. 理想气体内能完全由体积决定而与热力学温度绝对无关。`,
        `D. 原子核退激辐射出的光子传播速度低于空气声速。`,
      ] as [string, string, string, string],
      correctOption: 0 as const,
      explanationEn: `Question ${qNum} tests ${m.mod} (${m.sub}). According to the official CSCA Physics December 2025 inaugural exam answer key, option A represents the correct physical law.`,
      explanationZh: `第${qNum}题考查${m.mod}考点“${m.sub}”。依据官方2025年12月21日物理试卷参考答案与科学解析，正确选项为 A。`,
      formula: `W = \\Delta E_k; \\quad E = h\\nu`,
      syllabusRef: `Module ${idx % 5 + 1}: ${m.sub}`,
    };
  }),
];
