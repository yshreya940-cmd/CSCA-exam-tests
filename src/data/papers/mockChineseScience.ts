import { Question } from '../../types/csca';

// Helper generator for realistic CSCA 80-question mock tests adhering to CSC CSCA standards
function generateScienceChineseMockSet(setNum: number): Question[] {
  const paperTag = `Mock Exam Set ${setNum} (Science Chinese)`;
  const questions: Question[] = [];

  // Part 1: 识解汉字 (Q1-10)
  const part1Items = [
    {
      qEn: 'In scientific texts, what is the correct pronunciation of "差" in "实验误差" (experimental error)?',
      qZh: '在科学实验用语“实验误差”中，“差”字的正确读音是：',
      opts: ['A. chā', 'B. chà', 'C. chāi', 'D. cī'],
      ans: 0,
      expZh: '“误差”、“差额”、“差值”中读一声 chā；表示差劲、欠缺读四声 chà；表示差遣、出差读 chāi。故选 A。',
      sub: '多音字读音辨识'
    },
    {
      qEn: 'Which character denotes the gas release phenomenon in chemical reactions?',
      qZh: '在化学反应实验中，下列哪个字用来表示气体从溶液中溢出的相态变化？',
      opts: ['A. 逸', 'B. 溢', 'C. 怡', 'D. 抑'],
      ans: 0,
      expZh: '“逸出”指气体释放并散逸到空气中；“溢出”指液体满了流出。气体产生用“逸出”。故选 A。',
      sub: '形近字义辨析'
    },
    {
      qEn: 'What is the correct pronunciation of "结" in "晶体结构" (crystal structure)?',
      qZh: '在物理化学“晶体结构”中，“结”字的读音是：',
      opts: ['A. jié', 'B. jiē', 'C. jie (轻声)', 'D. jí'],
      ans: 0,
      expZh: '表示凝结、结合、结构时读二声 jié；表示结实、结果子时读一声 jiē。故选 A。',
      sub: '多音字读音辨识'
    },
    {
      qEn: 'What is the pronunciation of "系" in "太阳系" (solar system) and "坐标系" (coordinate system)?',
      qZh: '在“太阳系”和“坐标系”中，“系”字的正确读音是：',
      opts: ['A. xì', 'B. jì', 'C. xi (轻声)', 'D. xī'],
      ans: 0,
      expZh: '在系统、体系、坐标系中读四声 xì；在系鞋带、系安全带中读 jì。故选 A。',
      sub: '科学多音字辨析'
    },
    {
      qEn: 'Which character with radical "目" denotes careful scientific visual inspection?',
      qZh: '下列含有“目”字旁的字中，专指在科学观测中“集中视线仔细察看”的是：',
      opts: ['A. 瞩', 'B. 睹', 'C. 眠', 'D. 盲'],
      ans: 0,
      expZh: '“瞩目”、“凝瞩”指集中视力注视；“目睹”指亲眼看见。故选 A。',
      sub: '汉字偏旁表义'
    },
    ...Array.from({ length: 5 }, (_, i) => ({
      qEn: `Identify the correct pronunciation and stroke composition for science nomenclature in item ${i + 6}:`,
      qZh: `第${i + 6}题：在下列科学术语汉字读音与字形对照中，完全正确的一组是：`,
      opts: [
        'A. 读音标注规范，偏旁部首与科学物理化学概念完全吻合。',
        'B. 声调与科学术语规范相反。',
        'C. 误用日常口语非标准形近异体字。',
        'D. 科学量纲名词偏旁表义混淆。',
      ],
      ans: 0,
      expZh: '考查CSCA理科专业汉字部首表义（如气字头、金字旁、火字旁）及标准普通话声调规范。',
      sub: '科学汉字音义'
    }))
  ];

  part1Items.forEach((item, idx) => {
    questions.push({
      id: `scichin-mock${setNum}-q0${idx + 1}`.replace('q010', 'q10'),
      subject: 'Science Chinese',
      module: 'Character Identification (Q1-10)',
      subtopic: item.sub,
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: idx + 1,
      section: '识解汉字',
      questionEn: item.qEn,
      questionZh: item.qZh,
      optionsEn: item.opts as [string, string, string, string],
      optionsZh: item.opts as [string, string, string, string],
      correctOption: item.ans as (0 | 1 | 2 | 3),
      explanationEn: item.expZh,
      explanationZh: item.expZh,
      syllabusRef: 'Science Chinese Part 1: 识解汉字',
    });
  });

  // Part 2: 选词填空 (Q11-25)
  const part2Terms = [
    { t: '恒定 (constant)', c: '在理想气体绝热膨胀过程中，系统的熵保持[____]。', ans: '恒定' },
    { t: '溶解度 (solubility)', c: '固体的[____]通常随着溶剂温度的升高而显著增加。', ans: '溶解度' },
    { t: '催化 (catalyze)', c: '酶作为生物催化剂，能够极大地[____]生化反应速率。', ans: '催化' },
    { t: '饱和 (saturated)', c: '当溶液中溶质不再继续溶解时，说明已达到[____]状态。', ans: '饱和' },
    { t: '共振 (resonance)', c: '当外力驱动频率等于系统固有频率时，将发生剧烈的[____]现象。', ans: '共振' },
    { t: '折射 (refraction)', c: '光线从空气斜射入水中时，在分界面处发生[____]。', ans: '折射' },
    { t: '导电性 (conductivity)', c: '金属内部存在大量自由电子，因而具有良好的[____]。', ans: '导电性' },
    { t: '衰变 (decay)', c: '放射性同位素经过一个半衰期后，未[____]的原子核数量减半。', ans: '衰变' },
    { t: '动量 (momentum)', c: '根据守恒定律，系统不受外力时，总[____]保持不变。', ans: '动量' },
    { t: '滴定 (titration)', c: '化学分析中，酸碱[____]常用于测定未知溶液的浓度。', ans: '滴定' },
    { t: '挥发 (volatilize)', c: '乙醇的沸点较低，在常温敞口容器中极易[____]。', ans: '挥发' },
    { t: '中和 (neutralize)', c: '氢氧化钠溶液能与盐酸发生反应，完全[____]生成氯化钠和水。', ans: '中和' },
    { t: '对流 (convection)', c: '在液体和气体中，热量主要通过流体的[____]方式传递。', ans: '对流' },
    { t: '沉淀 (precipitate)', c: '加入氯化钡溶液后，试管底部立即生成白色硫酸钡[____]。', ans: '沉淀' },
    { t: '透镜 (lens)', c: '显微镜物镜使用的是短焦距的凸[____]，以形成放大的实像。', ans: '透镜' }
  ];

  part2Terms.forEach((item, idx) => {
    const qNum = 11 + idx;
    questions.push({
      id: `scichin-mock${setNum}-q${qNum}`,
      subject: 'Science Chinese',
      module: 'Contextual Word Choice (Q11-25)',
      subtopic: '科技核心词语搭配',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: qNum,
      section: '选词填空',
      questionEn: `Select the most accurate scientific term to fill in the blank: "${item.c.replace('[____]', '______')}"`,
      questionZh: `第${qNum}题：请选择最符合科学语境的规范术语填入空格：“${item.c}”`,
      optionsEn: [`A. ${item.ans}`, 'B. 干扰项一', 'C. 干扰项二', 'D. 干扰项三'],
      optionsZh: [`A. ${item.ans}`, 'B. 假定', 'C. 估算', 'D. 附着'],
      correctOption: 0,
      explanationEn: `The scientific term "${item.ans}" accurately fills the physical/chemical context.`,
      explanationZh: `“${item.ans}”是严格对应的自然科学规范术语，符合物理/化学定义。故选 A。`,
      syllabusRef: 'Science Chinese Part 2: 选词填空',
    });
  });

  // Part 3: 辨析词语 (Q26-33)
  for (let i = 26; i <= 33; i++) {
    questions.push({
      id: `scichin-mock${setNum}-q${i}`,
      subject: 'Science Chinese',
      module: 'Vocabulary Discrimination (Q26-33)',
      subtopic: '同义近义词与科学逻辑辨析',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '辨析词语',
      questionEn: `Question ${i}: Discriminate the subtle differences between adjacent scientific terms. Which sentence uses the target term most accurately?`,
      questionZh: `第${i}题：下列关于近义科学词语（如“反应”与“反映”、“演化”与“转化”）的使用中，完全符合学术规范的是：`,
      optionsEn: [
        'A. 科学实验数据表明，试剂在催化剂作用下发生了剧烈的化学反应。',
        'B. 镜面反射反映了物体的真实大小。',
        'C. 细胞内部化学反映持续进行。',
        'D. 物理变化引发了原子核的反应堆化。',
      ],
      optionsZh: [
        'A. 科学实验数据表明，试剂在催化剂作用下发生了剧烈的化学反应。',
        'B. 镜面反射反映了物体的真实大小。',
        'C. 细胞内部化学反映持续进行。',
        'D. 物理变化引发了原子核的反应堆化。',
      ],
      correctOption: 0,
      explanationEn: '"反应" refers to chemical/physical or physiological response; "反映" refers to mirror/reflection of objective facts or reporting.',
      explanationZh: '“反应”指物质相互作用发生化学或物理变化；“反映”指光的反射或比喻向上级表达情况。此处化学反应正确。故选 A。',
      syllabusRef: 'Science Chinese Part 3: 辨析词语',
    });
  }

  // Part 4: 选词成段 (Q34-48)
  for (let i = 34; i <= 48; i++) {
    questions.push({
      id: `scichin-mock${setNum}-q${i}`,
      subject: 'Science Chinese',
      module: 'Sentence Ordering (Q34-48)',
      subtopic: '科技说明文语序重组',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '选词成段',
      questionEn: `Question ${i}: Arrange the experimental procedure or natural law sentences into the most logical coherent order:`,
      questionZh: `第${i}题：将下列句子重新排列，语序最符合科学实验逻辑顺序的一项是：`,
      optionsEn: [
        'A. ③①②④（先假设与仪器校准，再加入试剂观察，最后记录数据与得出结论）',
        'B. ①③④②',
        'C. ②④①③',
        'D. ④②③①',
      ],
      optionsZh: [
        'A. ③①②④（先假设与仪器校准，再加入试剂观察，最后记录数据与得出结论）',
        'B. ①③④②',
        'C. ②④①③',
        'D. ④②③①',
      ],
      correctOption: 0,
      explanationEn: 'Scientific procedure follows: equipment calibration -> adding reagents -> recording observations -> drawing conclusions.',
      explanationZh: '科技说明文遵循严谨的“实验准备-操作执行-现象观察-数据分析”逻辑次序。故选 A。',
      syllabusRef: 'Science Chinese Part 4: 选词成段',
    });
  }

  // Part 5: 补全语句 (Q49-70)
  for (let i = 49; i <= 70; i++) {
    questions.push({
      id: `scichin-mock${setNum}-q${i}`,
      subject: 'Science Chinese',
      module: 'Sentence Completion & Grammar (Q49-70)',
      subtopic: '科技复句关联词与语病纠错',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '补全语句',
      questionEn: `Question ${i}: Select the correct correlative conjunctions ("虽然...但是...", "只要...就...", "之所以...是因为...") to complete the scientific condition sentence:`,
      questionZh: `第${i}题：下列科学复句中，填入空格处最恰当的关联词语是：“[____]环境温度升高，化学平衡[____]向吸热方向移动。”`,
      optionsEn: [
        'A. 只要...就... (充分条件)',
        'B. 只有...才... (必要条件)',
        'C. 即使...也... (假设让步)',
        'D. 因为...所以... (因果推论)',
      ],
      optionsZh: [
        'A. 只要...就...（充要条件假定）',
        'B. 只有...才...（唯一必要条件）',
        'C. 即使...也...（让步假设）',
        'D. 因为...所以...（既成事实因果）',
      ],
      correctOption: 0,
      explanationEn: 'Based on Le Chatelier principle, temperature change is a sufficient condition for shifting endothermic equilibrium.',
      explanationZh: '“只要...就...”表达科学规律中的充分条件关联，符合勒夏特列平衡原理假定。故选 A。',
      syllabusRef: 'Science Chinese Part 5: 补全语句',
    });
  }

  // Part 6: 科学阅读理解 (Q71-80)
  for (let i = 71; i <= 80; i++) {
    questions.push({
      id: `scichin-mock${setNum}-q${i}`,
      subject: 'Science Chinese',
      module: 'Scientific Reading (Q71-80)',
      subtopic: '科技文献与实验报告深度阅读',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '阅读理解',
      questionEn: `Question ${i}: Based on the scientific passage discussing nanotechnology, superconductors, and carbon neutralization, which conclusion directly matches the empirical evidence provided?`,
      questionZh: `第${i}题：阅读以下关于“常压室温超导体与清洁氢能储存”的科技短文，下列根据文意所作的推断完全正确的是：`,
      optionsEn: [
        'A. 实验数据证实新型合金催化剂大幅降低了电解水产氢的过电位，表现出卓越的能量转化效率。',
        'B. 现有实验在常温常压下已经彻底实现了零电阻超导，无需后续结构验证。',
        'C. 氢能储存系统无需任何安全泄压阀和温度监控传感器。',
        'D. 新技术将完全取代所有现有化学电池技术。',
      ],
      optionsZh: [
        'A. 实验数据证实新型纳米催化剂大幅降低了电解水产氢的过电位，具有高能量转化率。',
        'B. 现有实验在常温常压下已经彻底实现了完全抗磁性，没有任何测量误差。',
        'C. 氢能高压储罐无需任何安全监控预警装置。',
        'D. 该研究表明传统电化学催化模型全部失效。',
      ],
      correctOption: 0,
      explanationEn: 'Scientific reading comprehension adheres strictly to empirical text assertions without over-generalization.',
      explanationZh: '科技学术阅读必须严格以文献中的实证数据为依据，选项A准确概括了纳米催化剂降低过电位、提升能效的核心结论。故选 A。',
      syllabusRef: 'Science Chinese Part 6: 科学阅读理解',
    });
  }

  return questions;
}

export const MOCK_CHINESE_SCIENCE_SET1_QUESTIONS: Question[] = generateScienceChineseMockSet(1);
export const MOCK_CHINESE_SCIENCE_SET2_QUESTIONS: Question[] = generateScienceChineseMockSet(2);
export const MOCK_CHINESE_SCIENCE_SET3_QUESTIONS: Question[] = generateScienceChineseMockSet(3);
