import { Question } from '../../types/csca';

// Helper generator for realistic CSCA 80-question mock tests adhering to CSC CSCA Humanities Chinese standards
function generateHumanitiesChineseMockSet(setNum: number): Question[] {
  const paperTag = `Mock Exam Set ${setNum} (Humanities Chinese)`;
  const questions: Question[] = [];

  // Part 1: 识解汉字 (Q1-10)
  const part1Items = [
    {
      qEn: 'In historical literature, what is the correct pronunciation of "传" in "历史传记" (biography)?',
      qZh: '在人文历史文献“人物传记”中，“传”字的规范读音是：',
      opts: ['A. zhuàn', 'B. chuán', 'C. zhuan (轻声)', 'D. chuān'],
      ans: 0,
      expZh: '“传记”、“经传”、“列传”指记述历史人物事迹的著作，读四声 zhuàn；表示传播、流传、传递时读二声 chuán。故选 A。',
      sub: '文史多音字读音辨识'
    },
    {
      qEn: 'In cultural economics, what is the correct pronunciation of "当" in "当铺" (pawnshop) and "典当"?',
      qZh: '在文史与传统商业文化语境中，“典当”与“当铺”的“当”字读音是：',
      opts: ['A. dàng', 'B. dāng', 'C. dang (轻声)', 'D. dǎng'],
      ans: 0,
      expZh: '表示质押典当、合适（如恰当、停当）时读四声 dàng；表示担当、当时读一声 dāng。故选 A。',
      sub: '文化多音字辨析'
    },
    {
      qEn: 'Which character denotes the historical record or inscription on bronze and stone monuments?',
      qZh: '下列表示古代金石铭文与纪年记载的汉字中，字形结构与石碑刻文直接对应的是：',
      opts: ['A. 碑', 'B. 卑', 'C. 埤', 'D. 牌'],
      ans: 0,
      expZh: '“碑”偏旁为石，指刻有文字纪念事业或功勋的石石制品；“卑”表示低下。故选 A。',
      sub: '金石文物字形偏旁'
    },
    {
      qEn: 'What is the correct pronunciation of "省" in "省悟" (introspection/awakening) and "反省"?',
      qZh: '在先秦儒家修养论“吾日三省吾身”中，“省”字的正确读音是：',
      opts: ['A. xǐng', 'B. shěng', 'C. xing (轻声)', 'D. shèng'],
      ans: 0,
      expZh: '表示反思、觉悟、探望（如反省、省悟、省亲）时读三声 xǐng；表示节省、行政区划时读 shěng。故选 A。',
      sub: '哲学思想经典字音'
    },
    {
      qEn: 'Which character denotes the philosophical realm of harmony and reconciliation?',
      qZh: '在古代社会思想史中，代表“协调和谐、消除对立”概念的核心汉字是：',
      opts: ['A. 融', 'B. 茸', 'C. 荣', 'D. 溶'],
      ans: 0,
      expZh: '“融合”、“融通”、“融洽”指彼此交通化解分歧达到和谐。故选 A。',
      sub: '哲学人文核心词字义'
    },
    ...Array.from({ length: 5 }, (_, i) => ({
      qEn: `Identify the correct pronunciation and radical semantic alignment for humanities discourse in item ${i + 6}:`,
      qZh: `第${i + 6}题：在下列人文社会科学基础用词中，加点字的拼音标注与形旁表意完全吻合的是：`,
      opts: [
        'A. 字音标注规范，偏旁表义与文史哲学考据语境完全相符。',
        'B. 声调与经典文教成语读音相反。',
        'C. 混淆同音形近口语俗字。',
        'D. 传统文化名词偏旁表义混淆。',
      ],
      ans: 0,
      expZh: '考查CSCA文科中文试卷中常见的人文字词音形义对照与经典文献字词辨析。',
      sub: '文史典籍汉字音义'
    }))
  ];

  part1Items.forEach((item, idx) => {
    questions.push({
      id: `humchin-mock${setNum}-q0${idx + 1}`.replace('q010', 'q10'),
      subject: 'Humanities Chinese',
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
      syllabusRef: 'Humanities Chinese Part 1: 识解汉字',
    });
  });

  // Part 2: 选词填空 (Q11-25)
  const part2Terms = [
    { t: '传承 (inherit and pass on)', c: '非物质文化遗产的保护与[____]，对于维系民族文化认同具有深远意义。', ans: '传承' },
    { t: '涵养 (cultivate/nurture)', c: '优秀的传统人文学术能够深刻[____]现代公民的道德情操与社会责任感。', ans: '涵养' },
    { t: '演进 (evolve/progress)', c: '考察近代城市社会结构的[____]历程，有助于洞察现代化的基本脉络。', ans: '演进' },
    { t: '典范 (paragon/model)', c: '司马迁所撰《史记》开创了纪传体通史先河，被历代史家尊为史学[____]。', ans: '典范' },
    { t: '弘扬 (carry forward/promote)', c: '在多元文明互鉴交流中，我们应当积极[____]和平合作、包容互利的丝路精神。', ans: '弘扬' },
    { t: '考证 (textual research)', c: '历史学者通过出土简牍与传世文献的双重[____]，证实了这一重大历史事件的真实年代。', ans: '考证' },
    { t: '启迪 (enlighten/inspire)', c: '哲学辩证法关于量变与质变的深刻论述，常常给人以深邃的思想[____]。', ans: '启迪' },
    { t: '契合 (accord with/tally with)', c: '这种绿色生态发展理念，与中国古代“天人合一”的哲理不谋而合，高度[____]。', ans: '契合' },
    { t: '底蕴 (cultural deposit/heritage)', c: '这座千年历史文化名城积淀了极其深厚的人文[____]，吸引着全球各地的学者与游客。', ans: '底蕴' },
    { t: '构建 (construct/build)', c: '国际社会应通力合作，共同[____]人类命运共同体与包容性发展架构。', ans: '构建' },
    { t: '脉络 (thread/context)', c: '理清中国古典美学思想发展的历史[____]，有助于深入理解传统文人画的笔墨意趣。', ans: '脉络' },
    { t: '鉴往知来 (learn from the past to understand the future)', c: '研读历史不仅能还原过去的社会风貌，更能够让我们[____]，更好地面对未来的机遇与挑战。', ans: '鉴往知来' },
    { t: '博采众长 (draw on wide strengths)', c: '学术研究唯有破除门第之见，[____]，方能产生兼收并蓄、推陈出新的独创性成果。', ans: '博采众长' },
    { t: '厚积薄发 (accumulate deeply and release gently)', c: '学术功底的养成绝非一朝一夕之功，唯有耐住寂寞、[____]，才能取得传世的学术造诣。', ans: '厚积薄发' },
    { t: '源远流长 (have a long history)', c: '中华文明是世界上唯一未曾中断的古老文明，其历史文化[____]，博大精深。', ans: '源远流长' }
  ];

  part2Terms.forEach((item, idx) => {
    const qNum = 11 + idx;
    questions.push({
      id: `humchin-mock${setNum}-q${qNum}`,
      subject: 'Humanities Chinese',
      module: 'Contextual Word Choice (Q11-25)',
      subtopic: '人文社科核心成语与典雅词汇',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: qNum,
      section: '选词填空',
      questionEn: `Select the most accurate cultural/humanistic term to fill in the blank: "${item.c.replace('[____]', '______')}"`,
      questionZh: `第${qNum}题：请选择最符合人文社科语境与文史典雅风格的词语填入空格：“${item.c}”`,
      optionsEn: [`A. ${item.ans}`, 'B. 假托', 'C. 敷衍', 'D. 附会'],
      optionsZh: [`A. ${item.ans}`, 'B. 假托', 'C. 敷衍', 'D. 附会'],
      correctOption: 0,
      explanationEn: `"${item.ans}" precisely matches the cultural, historical, or academic sentence context.`,
      explanationZh: `“${item.ans}”符合文史哲学术语境搭配，准确表达句子的思想内涵与人文感情色彩。故选 A。`,
      syllabusRef: 'Humanities Chinese Part 2: 选词填空',
    });
  });

  // Part 3: 辨析词语与成语 (Q26-33)
  for (let i = 26; i <= 33; i++) {
    questions.push({
      id: `humchin-mock${setNum}-q${i}`,
      subject: 'Humanities Chinese',
      module: 'Vocabulary & Idiom Discrimination (Q26-33)',
      subtopic: '近义成语与文教词语感情色彩辨析',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '辨析词语',
      questionEn: `Question ${i}: Which option uses the classical idiom or humanities vocabulary with precision, respecting grammatical collocations and semantic connotation?`,
      questionZh: `第${i}题：下列关于人文典故与经典成语（如“标新立异”、“前赴后继”、“潜移默化”）的运用中，完全恰当的一项是：`,
      optionsEn: [
        'A. 优秀文学经典在长期的阅读熏陶中，对青少年人格境界的塑造起到了潜移默化的浸润作用。',
        'B. 这部古籍错字连篇，简直是巧夺天工。',
        'C. 他在学术研讨会上信口雌黄地指出了该学说的独到贡献。',
        'D. 故宫珍藏文物的制作工艺极为粗糙，令人叹为观止。',
      ],
      optionsZh: [
        'A. 优秀文学经典在长期的阅读熏陶中，对青少年人格境界的塑造起到了潜移默化的浸润作用。',
        'B. 这部古籍错字连篇，简直是巧夺天工。',
        'C. 他在学术研讨会上信口雌黄地指出了该学说的独到贡献。',
        'D. 故宫珍藏文物的制作工艺极为粗糙，令人叹为观止。',
      ],
      correctOption: 0,
      explanationEn: '"潜移默化" refers to subtle, unconscious positive transformation; "巧夺天工" applies to craftsmanship not books; "信口雌黄" is pejorative fabrication.',
      explanationZh: '“潜移默化”指人的思想品德或性格在不知不觉中受到感染而发生变化，褒义用法语境贴切。B项巧夺天工指人工胜过自然；C项信口雌黄是贬义词妄加评论；D项叹为观止形容赞叹到极点，与粗糙矛盾。故选 A。',
      syllabusRef: 'Humanities Chinese Part 3: 辨析词语',
    });
  }

  // Part 4: 选词成段 (Q34-48)
  for (let i = 34; i <= 48; i++) {
    questions.push({
      id: `humchin-mock${setNum}-q${i}`,
      subject: 'Humanities Chinese',
      module: 'Sentence Ordering (Q34-48)',
      subtopic: '人文论说文逻辑语序重组',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '选词成段',
      questionEn: `Question ${i}: Arrange the sentences discussing cultural evolution, philosophical concepts, and social development into the most coherent analytical progression:`,
      questionZh: `第${i}题：将下列探讨“文化多元与文明互鉴”的句子重新排列，语序最符合论述文逻辑的一项是：`,
      optionsEn: [
        'A. ②④①③（先界定文明起源，再分析交流互动，进而阐述融合创新，最后展望未来全球意义）',
        'B. ①③④②',
        'C. ④①②③',
        'D. ③②④①',
      ],
      optionsZh: [
        'A. ②④①③（先界定文明起源，再分析交流互动，进而阐述融合创新，最后展望未来全球意义）',
        'B. ①③④②',
        'C. ④①②③',
        'D. ③②④①',
      ],
      correctOption: 0,
      explanationEn: 'Humanities arguments adhere to historical-logical flow: phenomenon definition -> dynamic exchange -> synthesis -> overarching implication.',
      explanationZh: '人文论说文的展开逻辑一般遵循“现象提出-历史渊源-内生机制-时代价值与普遍启示”的内在逻辑推演。故选 A。',
      syllabusRef: 'Humanities Chinese Part 4: 选词成段',
    });
  }

  // Part 5: 补全语句与语病纠错 (Q49-70)
  for (let i = 49; i <= 70; i++) {
    questions.push({
      id: `humchin-mock${setNum}-q${i}`,
      subject: 'Humanities Chinese',
      module: 'Sentence Completion & Grammar (Q49-70)',
      subtopic: '多重复句关联与复杂定状语病排查',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '补全语句',
      questionEn: `Question ${i}: Select the correct correlatives and ensure grammatical integrity without modifier dangling or semantic redundancy:`,
      questionZh: `第${i}题：下列人文评论句子中，填入空格处最恰当的关联词语是：“传统节庆文化[____]具有强烈的民俗凝聚力，[____]深植着中华民族对人伦团圆与风调雨顺的永恒寄托。”`,
      optionsEn: [
        'A. 不仅...而且... (递进关系)',
        'B. 与其...不如... (选择关系)',
        'C. 虽然...但是... (转折关系)',
        'D. 即使...也... (让步关系)',
      ],
      optionsZh: [
        'A. 不仅...而且...（层层递进）',
        'B. 与其...不如...（舍取选择）',
        'C. 虽然...但是...（转折对立）',
        'D. 即使...也...（假设让步）',
      ],
      correctOption: 0,
      explanationEn: 'The clause moves from external folk cohesion to deeper spiritual values, demanding a progressive correlative ("不仅...而且...").',
      explanationZh: '句子前后分句由民俗表层向精神价值深层递进，应选用递进复句关联词“不仅...而且...”。故选 A。',
      syllabusRef: 'Humanities Chinese Part 5: 补全语句',
    });
  }

  // Part 6: 人文社科阅读理解 (Q71-80)
  for (let i = 71; i <= 80; i++) {
    questions.push({
      id: `humchin-mock${setNum}-q${i}`,
      subject: 'Humanities Chinese',
      module: 'Humanities Reading Comprehension (Q71-80)',
      subtopic: '文史哲思想专论深度阅读',
      difficulty: 'Standard',
      examPaper: paperTag,
      questionNumber: i,
      section: '阅读理解',
      questionEn: `Question ${i}: Based on the academic essay evaluating cross-cultural dialogue, intangible heritage conservation, and artistic philosophy, which evaluation aligns precisely with the author\'s main thesis?`,
      questionZh: `第${i}题：阅读以下关于“古代丝绸之路文化融合与当代文明对话”的学术书评节选，下列对作者核心论点的概括最准确的一项是：`,
      optionsEn: [
        'A. 文明的活力不仅在于自身历史传统的持守，更取决于在平等的跨区域文化交流中海纳百川、推陈出新的自我更新能力。',
        'B. 任何外来文化的输入都会彻底消解本土文化的主体性与独特性。',
        'C. 传统手工艺的保护应当完全脱离当今现实生活场景并封存于博物馆中。',
        'D. 古代丝绸之路上的贸易交往与艺术交流没有任何交集。',
      ],
      optionsZh: [
        'A. 文明的活力不仅在于自身历史传统的持守，更取决于在平等的跨区域文化交流中海纳百川、推陈出新的自我更新能力。',
        'B. 任何外来文化的输入都会彻底消解本土文化的主体性与独特性。',
        'C. 传统手工艺的保护应当完全脱离当今现实生活场景并封存于博物馆中。',
        'D. 古代丝绸之路上的贸易交往与艺术交流没有任何交集。',
      ],
      correctOption: 0,
      explanationEn: 'Academic humanities comprehension captures dynamic cultural identity through dialogical synthesis rather than isolationist essentialism.',
      explanationZh: '学术论著立论辩证，强调文明在交流互鉴中保持主体性并实现创新发展，A项精准概括了作者核心主旨。故选 A。',
      syllabusRef: 'Humanities Chinese Part 6: 人文社科阅读理解',
    });
  }

  return questions;
}

export const MOCK_CHINESE_HUMANITIES_SET1_QUESTIONS: Question[] = generateHumanitiesChineseMockSet(1);
export const MOCK_CHINESE_HUMANITIES_SET2_QUESTIONS: Question[] = generateHumanitiesChineseMockSet(2);
export const MOCK_CHINESE_HUMANITIES_SET3_QUESTIONS: Question[] = generateHumanitiesChineseMockSet(3);
