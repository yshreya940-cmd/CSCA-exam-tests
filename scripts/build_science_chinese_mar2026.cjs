const fs = require('fs');

const raw = fs.readFileSync('extracted_science_chinese_mar2026.txt', 'utf8');

// Official answers parsed directly from line 234-238
const answerKeys = {
  1: 'A', 2: 'B', 3: 'C', 4: 'C', 5: 'A', 6: 'B', 7: 'A', 8: 'A', 9: 'B', 10: 'B',
  11: 'F', 12: 'B', 13: 'A', 14: 'D', 15: 'E', 16: 'C', 17: 'E', 18: 'A', 19: 'B', 20: 'F',
  21: 'C', 22: 'B', 23: 'E', 24: 'D', 25: 'F', 26: 'B', 27: 'C', 28: 'B', 29: 'B', 30: 'B',
  31: 'A', 32: 'C', 33: 'B', 34: 'A', 35: 'B', 36: 'D', 37: 'C', 38: 'E', 39: 'D', 40: 'B',
  41: 'E', 42: 'A', 43: 'C', 44: 'D', 45: 'A', 46: 'B', 47: 'C', 48: 'E', 49: 'A', 50: 'B',
  51: 'C', 52: 'A', 53: 'B', 54: 'B', 55: 'C', 56: 'A', 57: 'B', 58: 'A', 59: 'B', 60: 'B',
  61: 'A', 62: 'C', 63: 'B', 64: 'B', 65: 'B', 66: 'B', 67: 'A', 68: 'D', 69: 'B', 70: 'B',
  71: 'B', 72: 'B', 73: 'D', 74: 'A', 75: 'B', 76: 'C', 77: 'A', 78: 'A', 79: 'B', 80: 'B'
};

// Map letter to 0-indexed option
function letterToIndex(letter) {
  const map = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };
  return map[letter] !== undefined ? map[letter] : 0;
}

// Group 11-15 options: (A) 测量 (B) 分析 (C) 溶解 (D) 过滤 (E) 计算 (F) 搅拌
const g11_15_opts = ['A. 测量', 'B. 分析', 'C. 溶解', 'D. 过滤', 'E. 计算', 'F. 搅拌'];
// Group 16-20 options: (A) 稳定 (B) 精确 (C) 透明 (D) 坚硬 (E) 导电 (F) 易燃
const g16_20_opts = ['A. 稳定', 'B. 精确', 'C. 透明', 'D. 坚硬', 'E. 导电', 'F. 易燃'];
// Group 21-25 options: (A) 原理 (B) 装置 (C) 变量 (D) 结论 (E) 试剂 (F) 样本
const g21_25_opts = ['A. 原理', 'B. 装置', 'C. 变量', 'D. 结论', 'E. 试剂', 'F. 样本'];
// Group 34-38 options: (A) 观察 (B) 记录 (C) 验证 (D) 推导 (E) 改进
const g34_38_opts = ['A. 观察', 'B. 记录', 'C. 验证', 'D. 推导', 'E. 改进'];
// Group 39-43 options: (A) 能量 (B) 质量 (C) 温度 (D) 压强 (E) 密度
const g39_43_opts = ['A. 能量', 'B. 质量', 'C. 温度', 'D. 压强', 'E. 密度'];
// Group 44-48 options: (A) 操作 (B) 研究 (C) 应⽤ (D) 探索 (E) 发明
const g44_48_opts = ['A. 操作', 'B. 研究', 'C. 应⽤', 'D. 探索', 'E. 发明'];

const questionDefs = [
  // 1-10
  {
    num: 1,
    stem: "“这个实验的结果测量得很准，误差很⼩。”句中的“量”怎么读？（）",
    opts: ["A. liáng", "B. liàng", "C. liang", "D. lián"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“测量”作动词表示测定，读二声 liáng；“量”作名词时（如容量、力量）读四声 liàng。故正确答案为 A。"
  },
  {
    num: 2,
    stem: "“他调好了显微镜，开始观察细胞结构。”句中的“调”怎么读？（）",
    opts: ["A. diào", "B. tiáo", "C. tiāo", "D. diāo"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“调好”表示调整、调节使之合适，读 tiáo；表示调查、调动时读 diào。故正确答案为 B。"
  },
  {
    num: 3,
    stem: "“盛”读⾳不同的⼀项是：（）",
    opts: ["A. 盛⽔", "B. 盛器", "C. 盛开", "D. 盛饭"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "A、B、D 选项中的“盛”均读 chéng，表示把东西放进去或装盛器皿；C 选项“盛开”读 shèng，表示旺盛、茂盛。故 C 读音与其他不同。"
  },
  {
    num: 4,
    stem: "“数”读⾳不同的⼀项是：（）",
    opts: ["A. 数字", "B. 数学", "C. 数星星", "D. 数据"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "A、B、D 选项中的“数”读 shù，表示数学、数目；C 选项“数星星”是动词，读 shǔ，表示查点数目。故选 C。"
  },
  {
    num: 5,
    stem: "“这个公式的计( suàn )过程⼀定要仔细，不能出错。”正确的汉字是：（）",
    opts: ["A. 算", "B. 篡", "C. 蒜", "D. 笋"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“计算”指运用数学规律推导数值，汉字写作“算”。故正确答案为 A。"
  },
  {
    num: 6,
    stem: "“实验前要检查仪( qì )是否正常运⾏。”正确的汉字是：（）",
    opts: ["A. ⽓", "B. 器", "C. 汽", "D. 泣"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“仪器”指科学技术上用于实验、计量的器具，字形为“器”。故正确答案为 B。"
  },
  {
    num: 7,
    stem: "“烧杯中的液体达到了指定的容( liàng )。”正确的汉字是：（）",
    opts: ["A. 量", "B. 凉", "C. 亮", "D. 梁"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“容量”指容器所能容纳物质的量，汉字写作“量”。故正确答案为 A。"
  },
  {
    num: 8,
    stem: "“完成实验后，要及时记( lù )数据和现象。”正确的汉字是：（）",
    opts: ["A. 录", "B. 陆", "C. 禄", "D. 碌"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“记录”指把听到的话或看到的事实写下来，字形为“录”。故正确答案为 A。"
  },
  {
    num: 9,
    stem: "下列哪个汉字的意思与“⽕/热”有关？（）",
    opts: ["A. 河", "B. 熔", "C. ⽊", "D. ⼟"],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "“熔”带有“火”字旁，专指固体受热变软并化为液体（如熔化、熔点）。故选 B。"
  },
  {
    num: 10,
    stem: "请选出“化”字意义不同的⼀项：（）",
    opts: [
      "A. 这个物质发⽣了化学反应，⽣成了新物质。",
      "B. 我们要学会化繁为简，梳理实验步骤。",
      "C. 催化剂能加快反应速率，且本身性质不变。",
      "D. ⽔遇冷会凝结，这是物理变化，不是化学变化。"
    ],
    sec: "识解汉字",
    mod: "Character Identification (Q1-10)",
    expZh: "A、C、D 选项中的“化”均指化学反应、学科分支；B 选项“化繁为简”中的“化”为使……变得、转化之意。故 B 项意义不同。"
  },

  // 11-15 (A) 测量 (B) 分析 (C) 溶解 (D) 过滤 (E) 计算 (F) 搅拌
  {
    num: 11,
    stem: "做化学实验时，⽤玻璃棒______液体，能让溶质更快溶解。",
    opts: g11_15_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "在化学实验操作中，用玻璃棒“搅拌”能够加速溶质在溶剂中的扩散与溶解。故选 F。"
  },
  {
    num: 12,
    stem: "实验结束后，我们需要对收集到的数据进⾏______，总结规律。",
    opts: g11_15_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "对实验收集到的数据进行“分析”是科学归纳规律的标准学术表达。故选 B。"
  },
  {
    num: 13,
    stem: "⽤刻度尺______物体的⻓度，要注意视线与刻度线相平。",
    opts: g11_15_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "用刻度尺“测量”长度，测量是确定物理量量值的操作。故选 A。"
  },
  {
    num: 14,
    stem: "混合溶液中的不溶性杂质，需要通过______的⽅法分离。",
    opts: g11_15_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "分离液体与难溶性固相杂质的标准实验室化学操作是“过滤”。故选 D。"
  },
  {
    num: 15,
    stem: "根据已知条件______出物体的运动速度，这是物理计算题的基础。",
    opts: g11_15_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "根据已知数理公式推导出未知速度数值，属于“计算”。故选 E。"
  },

  // 16-20 (A) 稳定 (B) 精确 (C) 透明 (D) 坚硬 (E) 导电 (F) 易燃
  {
    num: 16,
    stem: "玻璃容器的特点是______，能清晰观察到内部的实验现象。",
    opts: g16_20_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "玻璃具有透光性，即“透明”，便于肉眼直接观察内部反应。故选 C。"
  },
  {
    num: 17,
    stem: "做电学实验时，要选择______性能好的导线，保证电路通畅。",
    opts: g16_20_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "电路要求低阻抗顺畅传输电流，必须具备良好的“导电”性能。故选 E。"
  },
  {
    num: 18,
    stem: "实验中使⽤的仪器要保持状态______，否则会影响实验结果。",
    opts: g16_20_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "实验测试设备需保持性能和工作基线“稳定”，避免晃动与漂移。故选 A。"
  },
  {
    num: 19,
    stem: "刻度尺的刻度标注很______，能满⾜精细测量的需求。",
    opts: g16_20_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "满足精细微观测量的刻度具有很高的“精确”度。故选 B。"
  },
  {
    num: 20,
    stem: "酒精是______物质，实验时要远离明⽕，注意安全。",
    opts: g16_20_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "乙醇闪点低极易着火，属于“易燃”危险化学品。故选 F。"
  },

  // 21-25 (A) 原理 (B) 装置 (C) 变量 (D) 结论 (E) 试剂 (F) 样本
  {
    num: 21,
    stem: "做对⽐实验时，要控制好单⼀______，确保实验结果的有效性。",
    opts: g21_25_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "科学控制变量法要求保持其他条件一致，只改变单一“变量”。故选 C。"
  },
  {
    num: 22,
    stem: "实验前要检查实验______是否安装正确，避免出现故障。",
    opts: g21_25_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "由多个仪器组装配合构成的系统称为实验“装置”。故选 B。"
  },
  {
    num: 23,
    stem: "化学实验中，使⽤的______要贴好标签，防⽌混淆。",
    opts: g21_25_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "用于化验、反应的各种化学药品称作“试剂”。故选 E。"
  },
  {
    num: 24,
    stem: "经过多次实验和验证，我们最终得出了科学的______。",
    opts: g21_25_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "在实验推导与验证的最后阶段，形成的判断与判定称为“结论”。故选 D。"
  },
  {
    num: 25,
    stem: "研究⽣物特性时，要采集⾜够数量的______，保证研究的普遍性。",
    opts: g21_25_opts,
    sec: "词语填空",
    mod: "Scientific Vocabulary (Q11-25)",
    expZh: "从总体中抽取供检验分析的个体材料称为“样本”。故选 F。"
  },

  // 26-33 近义反义词
  {
    num: 26,
    stem: "“这个实验的结果⾮常准确，没有偏差。”与“准确”意思相近的词是：（）",
    opts: ["A. 模糊", "B. 精确", "C. ⼤概", "D. 错误"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“准确”指行动的结果完全符合实际，“精确”强调非常精密确切，二者为近义词。故选 B。"
  },
  {
    num: 27,
    stem: "“在实验过程中，我们必须严格遵守操作规范。”与“严格”意思相近的词是：（）",
    opts: ["A. 宽松", "B. 随意", "C. 严谨", "D. ⻢⻁"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“严谨”形容严肃谨慎，严格遵照规范，与“严格”意义相近。故选 C。"
  },
  {
    num: 28,
    stem: "“这种材料的韧性很好，不容易断裂。”与“韧性”意思相近的词是：（）",
    opts: ["A. 脆性", "B. 弹性", "C. 硬度", "D. 密度"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“韧性”指材料抗断裂与变形回弹的能力，在力学性质上与“弹性”最接近。故选 B。"
  },
  {
    num: 29,
    stem: "“我们要逐步推进实验，不能急于求成。”与“逐步”意思相近的词是：（）",
    opts: ["A. 突然", "B. 渐渐", "C. ⽴刻", "D. 快速"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“逐步”指一步一步发展，“渐渐”指程度或数量逐步缓慢增加，二者为近义词。故选 B。"
  },
  {
    num: 30,
    stem: "“实验数据必须真实，不能伪造和修改。”与“真实”意思相近的词是：（）",
    opts: ["A. 虚假", "B. 客观", "C. ⽚⾯", "D. 主观"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“真实”指符合事实本貌，“客观”指不依人的意志为转移、如实反映外部存在，二者近义。故选 B。"
  },
  {
    num: 31,
    stem: "“这个反应的速率很快，⼏分钟就完成了。”与“快”意思相反的词是：（）",
    opts: ["A. 慢", "B. 久", "C. ⻓", "D. 短"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“快”形容速度高，“慢”形容速度低，二者为直接反义词。故选 A。"
  },
  {
    num: 32,
    stem: "“纯⽔中的杂质含量很低，⽔质很纯净。”与“纯净”意思相反的词是：（）",
    opts: ["A. ⼲净", "B. 清澈", "C. 浑浊", "D. 透明"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "“纯净”指不含杂质、清亮，“浑浊”指水中含有沉淀杂质不透亮，二者为反义词。故选 C。"
  },
  {
    num: 33,
    stem: "“这种⾦属的熔点很⾼，不容易熔化。”与“⾼”意思相反的词是：（）",
    opts: ["A. ⼤", "B. 低", "C. ⼩", "D. 矮"],
    sec: "近义反义词",
    mod: "Synonyms & Antonyms (Q26-33)",
    expZh: "温度数值通常以“高”与“低”搭配，与“熔点高”相反的是“熔点低”。故选 B。"
  },

  // 34-38 (A) 观察 (B) 记录 (C) 验证 (D) 推导 (E) 改进
  {
    num: 34,
    stem: "做实验时，要仔细______实验现象，不放过任何细节。",
    opts: g34_38_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "仔细审视和察看实验中的动态物理化学表象，常用搭配为“观察现象”。故选 A。"
  },
  {
    num: 35,
    stem: "把每⼀组数据准确______下来，是后续分析的基础。",
    opts: g34_38_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "把测试读数书写或登载于表格中，搭配为“记录数据”。故选 B。"
  },
  {
    num: 36,
    stem: "根据实验结果______出相关公式，实现理论与实践结合。",
    opts: g34_38_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "依据数理逻辑从前提到结论导出数理方程，动词为“推导公式”。故选 D。"
  },
  {
    num: 37,
    stem: "⽤新的实验⽅法______之前的结论，确保其科学性。",
    opts: g34_38_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "通过再次实验检验证实某个学说或推论，动词为“验证结论”。故选 C。"
  },
  {
    num: 38,
    stem: "发现实验⽅案的不⾜后，要及时______，提⾼实验效率。",
    opts: g34_38_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "改变旧有缺点使方案更加完善，动词为“改进方案”。故选 E。"
  },

  // 39-43 (A) 能量 (B) 质量 (C) 温度 (D) 压强 (E) 密度
  {
    num: 39,
    stem: "⽔的沸点会随外界______的变化⽽变化，⽓压越低，沸点越低。",
    opts: g39_43_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "气压属于力学中的“压强”物理量，液体沸点随气压变化。故选 D。"
  },
  {
    num: 40,
    stem: "物体所含物质的多少，叫做物体的______，其单位是千克。",
    opts: g39_43_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "物体所含物质的多少定义为“质量”，国际单位制为主单位千克（kg）。故选 B。"
  },
  {
    num: 41,
    stem: "单位体积的某种物质的质量，叫做这种物质的______。",
    opts: g39_43_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "单位体积质量的标准物理学定义是“密度”（ρ = m/V）。故选 E。"
  },
  {
    num: 42,
    stem: "酒精灯的⽕焰能提供______，使烧杯中的⽔温度升膏。",
    opts: g39_43_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "火焰燃烧释放热能，向系统传递热“能量”。故选 A。"
  },
  {
    num: 43,
    stem: "测量液体的______时，要使⽤温度计，且玻璃泡不能接触容器壁。",
    opts: g39_43_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "温度计测量的对应物理量为“温度”。故选 C。"
  },

  // 44-48 (A) 操作 (B) 研究 (C) 应⽤ (D) 探索 (E) 发明
  {
    num: 44,
    stem: "科学家们不断______未知的科学领域，推动科技进步。",
    opts: g44_48_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "对未知自然领域开拓寻访，搭配动词为“探索未知领域”。故选 D。"
  },
  {
    num: 45,
    stem: "掌握正确的实验______⽅法，是保证实验安全的前提。",
    opts: g44_48_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "按照规范程序动作使用仪器进行试验，动宾短语为“实验操作”。故选 A。"
  },
  {
    num: 46,
    stem: "经过多年的______，他终于发现了这种新的元素。",
    opts: g44_48_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "探求事物的真相、性质与规律，搭配名词/动词为“研究”。故选 B。"
  },
  {
    num: 47,
    stem: "把科学理论转化为实际______，能为⽣活带来便利。",
    opts: g44_48_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "使科技成果投入生产生活中使用，称作“实际应用”。故选 C。"
  },
  {
    num: 48,
    stem: "爱迪⽣经过上千次实验，终于______了电灯，照亮了世界。",
    opts: g44_48_opts,
    sec: "选词填空",
    mod: "Context Vocabulary (Q34-48)",
    expZh: "创造出前所未有的新事物与新装置，用词为“发明”。故选 E。"
  },

  // 49-70 补全语句
  {
    num: 49,
    stem: "这个实验太复杂了，我没有做______。（）",
    opts: ["A. 完", "B. 好", "C. 成", "D. 透"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“没有做完”表示动作未完成至终点，符合“实验复杂耗时长未能收尾”的语境。故选 A。"
  },
  {
    num: 50,
    stem: "他______昨天完成的这个重要实验。（）",
    opts: ["A. 才", "B. 是", "C. 刚", "D. 都"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“是……的”为汉语强调句型，此处“是他昨天完成的”强调动作发生的时间。故选 B。"
  },
  {
    num: 51,
    stem: "我花了三个⼩时______把这个物理模型做好。（）",
    opts: ["A. 就", "B. ⼜", "C. 才", "D. 也"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“才”表示说话人认为耗费时间长、费力，“花了三个小时才做好”符合语意。故选 C。"
  },
  {
    num: 52,
    stem: "这个公式______解决⼒学问题⾮常有⽤。（）",
    opts: ["A. 对", "B. 跟", "C. ⽐", "D. 和"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“对……有用/有帮助”为固定介词搭配。故选 A。"
  },
  {
    num: 53,
    stem: "在标准⼤⽓压下，⽔的沸点______酒精的沸点。（）",
    opts: ["A. ⾼", "B. ⾼于", "C. 很⾼", "D. ⼀点⼉⾼"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "在客观学术科学陈述中，两量对比用“高于”表示比较关系（水沸点100℃高于乙醇78℃）。故选 B。"
  },
  {
    num: 54,
    stem: "外国⼈______喜欢中国的航天技术，中国⼈更是引以为傲。（）",
    opts: ["A. 不但现在", "B. 现在不但", "C. 不但中国⼈", "D. 中国⼈不但"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "时间副词“现在”置于句首或主语后，“外国人现在不但喜欢……”递进至后半句“更引以为傲”。故选 B。"
  },
  {
    num: 55,
    stem: "做完实验后，我想______。（）",
    opts: ["A. 个⼿洗", "B. 洗⼿个", "C. 洗个⼿", "D. ⼿个洗"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "动宾离合词“洗手”插入数量词组作补语时，标准语序为动词+数量+宾语：“洗个手”。故选 C。"
  },
  {
    num: 56,
    stem: "我永远忘不了那个______。（）",
    opts: [
      "A. 在实验室认真做实验的年轻科学家",
      "B. 认真做实验在实验室年轻的科学家",
      "C. 在实验室年轻认真做实验的科学家",
      "D. 年轻在实验室做实验认真的科学家"
    ],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "现代汉语多层定语的标准修饰排序通常为：地点状语从句（在实验室）+ 状态副词动作（认真做实验的）+ 年龄/性质形容词（年轻）+ 中心语（科学家）。A 选项语序最自然纯正。故选 A。"
  },
  {
    num: 57,
    stem: "我们希望同学们能够______。（）",
    opts: [
      "A. ⼀直保持严谨的实验态度下去",
      "B. 把严谨的实验态度⼀直保持下去",
      "C. ⼀直保持下去严谨的实验态度",
      "D. 把严谨的实验态度保持⼀直下去"
    ],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“把”字句结构为：把+宾语+副词+动词+趋向补语：“把严谨的实验态度一直保持下去”。故选 B。"
  },
  {
    num: 58,
    stem: "他的实验成果获得了国家科技奖，同事们都来向他______。（）",
    opts: ["A. 表示祝贺", "B. 赢得⽀持", "C. 送上感谢", "D. 付出关⼼"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "获国家科技奖应道喜贺喜，对应搭配为“向他表示祝贺”。故选 A。"
  },
  {
    num: 59,
    stem: "科学实验是⼀件很有意义的事，我们要______实验的乐趣。（）",
    opts: ["A. 宣传⽂化", "B. 充分享受", "C. 相当精彩", "D. 诸多⽅⾯"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "与“乐趣”搭配的动词为“享受”，“充分享受实验的乐趣”。故选 B。"
  },
  {
    num: 60,
    stem: "学好数学很重要，它就像⼀把钥匙，让我明⽩了______。（）",
    opts: ["A. 数学的⽆⽤", "B. 理科学习的重要性", "C. 学习的枯燥", "D. 实验的麻烦"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "数学作为基础学科的比喻意义是揭示“理科学习的重要性”，符合积极语境。故选 B。"
  },
  {
    num: 61,
    stem: "⽜顿的万有引⼒定律充满智慧和思考，读懂它就能感受到______。（）",
    opts: ["A. 科学的魅⼒", "B. ⽂学的优美", "C. 艺术的浪漫", "D. 历史的厚重"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "万有引力定律是经典物理学定理，展现的是“科学的魅力”。故选 A。"
  },
  {
    num: 62,
    stem: "理科⽣要学会观察与思考，这些都是他们进⾏______的重要能⼒。（）",
    opts: ["A. ⽂学创作", "B. 艺术欣赏", "C. 科学研究", "D. 历史考证"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "理科生的观察思考能力直接服务于“科学研究”。故选 C。"
  },
  {
    num: 63,
    stem: "实验⽐赛快开始了，同学们正______地准备着实验器材。（）",
    opts: ["A. 开开⼼⼼", "B. 急急忙忙", "C. 整整⻬⻬", "D. ⼲⼲净净"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "比赛临近开赛的时间紧迫感，用重叠词“急急忙忙”形容准备器材的紧张状态。故选 B。"
  },
  {
    num: 64,
    stem: "不管是居⾥夫⼈发现镭，还是屠呦呦提取⻘蒿素，都深深印在我⼼⾥，让我______。（）",
    opts: ["A. ⾮常开⼼", "B. 难以忘记", "C. 特别舒服", "D. 不会难过"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“深深印在心里”与“难以忘记”语义相呼应，强调深刻记忆。故选 B。"
  },
  {
    num: 65,
    stem: "实验室⾥有很多仪器，有的是显微镜，有的是烧杯，______是酒精灯，⽤途各不相同。（）",
    opts: ["A. 再有的", "B. 还有的", "C. 其他的", "D. 另有的"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "“有的……有的……还有的……”为常用排比例举句型。故选 B。"
  },
  {
    num: 66,
    stem: "爱因斯坦的相对论指出，时间和空间不是独⽴的，⽽是互相______。（）",
    opts: ["A. 没关系", "B. 联系", "C. 能分开", "D. 相⽭盾"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "相对论时空观表明时空相互交织、互相“联系”，构成四维时空连续统。故选 B。"
  },
  {
    num: 67,
    stem: "天平是⼀种______，放在⽔平台上，调节平衡螺⺟，就能测量物体的质量。（）",
    opts: ["A. 测量⼯具", "B. 绘画材料", "C. 书写⼯具", "D. 演奏乐器"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "天平是实验室测量质量的基本“测量工具”。故选 A。"
  },
  {
    num: 68,
    stem: "元素周期表由⻔捷列夫编制，按原⼦序数排列，是化学领域⼀套______。（）",
    opts: ["A. 绘画体系", "B. ⽂字系统", "C. ⾳乐体系", "D. 科学体系"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "元素周期表总结了化学元素性质的递变规律，属于严密的“科学体系”。故选 D。"
  },
  {
    num: 69,
    stem: "《昆⾍记》是⼀部科学著作，⾥⾯的法布尔很细⼼，他______，观察昆⾍的⽣活习性。（）",
    opts: ["A. ⾛来⾛去", "B. 蹲来蹲去", "C. 游来游去", "D. ⻜来⻜去"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "观察地面草丛中微小昆虫生活形态的细心姿态为“蹲来蹲去”。故选 B。"
  },
  {
    num: 70,
    stem: "理科有四个重要的学科：物理、化学、⽣物、数学，每个学科都有⾃⼰特别的______。（）",
    opts: ["A. 庆祝⽅式", "B. 研究⽅法", "C. 相同意义", "D. 唱歌跳舞"],
    sec: "补全语句",
    mod: "Syntax & Sentence Completion (Q49-70)",
    expZh: "各自然科学学科拥有各自独特的规律和科学“研究方法”。故选 B。"
  },

  // 71-80 阅读理解
  {
    num: 71,
    stem: "【短文一：实验注意事项】短⽂主要介绍了做科学实验时：（）",
    opts: ["A. 如何整理实验台", "B. 需注意的⽅⾯", "C. 如何选择试剂", "D. 器材的种类"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "短文围绕实验前检查、实验中按规程操作、记录数据和整理器材展开，总括句为“你知道做科学实验时需要注意什么吗？”，故主要介绍“需注意的方面”。答案选 B。"
  },
  {
    num: 72,
    stem: "【短文一：实验注意事项】实验数据的作⽤是：（）",
    opts: ["A. 装饰实验报告", "B. 分析结论的依据", "C. 随意记录即可", "D. 展示给同学看"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "原文明确指出：“数据是分析结论的重要依据，不能遗漏或伪造。”故答案选 B。"
  },
  {
    num: 73,
    stem: "【短文二：科学观察】“尽管”填⼊短⽂中哪⼀处⽐较合适？（）",
    opts: ["A. 甲", "B. ⼄", "C. 丙", "D. 丁"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "丁处后文接“有工具辅助，但观察者的细心和耐心至今仍不可或缺”，与转折连词“但”构成典型的“尽管……但……”让步转折搭配。故选 D。"
  },
  {
    num: 74,
    stem: "【短文二：科学观察】填⼊⽂中“______”处，最合适的词语是：（）",
    opts: ["A. 尤其", "B. 究竟", "C. 反⽽", "D. 甚⾄"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "此处强调观察短暂实验现象时的特殊专注要求，“尤其”用于进一步递进举例最合适。故选 A。"
  },
  {
    num: 75,
    stem: "【短文二：科学观察】科学观察为什么需要使⽤⼯具？（）",
    opts: ["A. 为了让观察更有趣", "B. 突破⼈类感官的限制", "C. 为了节省观察时间", "D. ⽅便与同学交流"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "短文丙处明确说明：“使用观察工具，主要是为了突破人类感官的限制，看到更细微、更遥远的事物”。故选 B。"
  },
  {
    num: 76,
    stem: "【短文三：仪器铭牌】理科实验仪器的铭牌上包含什么？（）",
    opts: ["A. 仪器颜⾊", "B. ⽣产⼚家", "C. 关键参数", "D. 实验者姓名"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "短文第一句说明：“实验仪器的铭牌上都会标注关键参数，由字母、数字和单位共同组成”。故选 C。"
  },
  {
    num: 77,
    stem: "【短文三：仪器铭牌】通过仪器铭牌，我们可以知道什么？（）",
    opts: ["A. 仪器的使⽤范围", "B. 仪器的购买价格", "C. 仪器的摆放位置", "D. 仪器的⽣产时间"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "原文指出：“看仪器铭牌上的参数，就能知道这款仪器的性能和使用范围，避免因超量程使用导致损坏”。故选 A。"
  },
  {
    num: 78,
    stem: "【短文四：科学实验室】科学实验室的主要功能是：（）",
    opts: ["A. 提供实验研究空间", "B. 销售实验仪器", "C. 举办⽂艺活动", "D. 存放图书资料"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "原文首段指出：“为师生和科研人员提供了专业、安全的实验研究空间”。故选 A。"
  },
  {
    num: 79,
    stem: "【短文四：科学实验室】科学实验室的意义包括以下哪⼀项？（）",
    opts: ["A. 成为旅游景点", "B. 提供理科实践平台", "C. 销售理科书籍", "D. 举办体育⽐赛"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "短文第二段阐述意义时首要指出：“首先，它们为理科学习提供了实践平台，让学习者把理论知识转化为实际操作能力”。故选 B。"
  },
  {
    num: 80,
    stem: "【短文四：科学实验室】科学实验室通过什么⽅式推动科学技术的创新与发展？（）",
    opts: ["A. 举办书法⽐赛", "B. 开展科学实验和技术研发", "C. 销售电⼦产品", "D. 组织旅游活动"],
    sec: "阅读理解",
    mod: "Technical Reading Comprehension (Q71-80)",
    expZh: "原文指出：“各类科学实验、技术研发、课题研究等活动在这里开展，研究者们可以在这里验证猜想、探索未知，推动科学技术的创新与发展”。故选 B。"
  }
];

const generatedQuestions = questionDefs.map((q) => {
  const ansLetter = answerKeys[q.num];
  const correctIdx = letterToIndex(ansLetter);
  const qIdStr = q.num < 10 ? '0' + q.num : '' + q.num;

  return {
    id: `scichin-2026-03-q${qIdStr}`,
    subject: "Science Chinese",
    module: q.mod,
    subtopic: q.sec,
    difficulty: q.num <= 25 ? "Standard" : (q.num <= 60 ? "Challenging" : "Standard"),
    examPaper: "March 2026 Official Exam",
    questionNumber: q.num,
    section: q.sec,
    questionEn: `[Question ${q.num}] ${q.stem}`,
    questionZh: q.stem,
    optionsEn: q.opts,
    optionsZh: q.opts,
    correctOption: correctIdx,
    explanationEn: `[Official Answer: Option ${ansLetter}] ${q.expZh}`,
    explanationZh: `【官方标准答案：${ansLetter}】${q.expZh}`,
    syllabusRef: `Science Chinese: ${q.sec}`
  };
});

const fileHeader = `import { Question } from '../../types/csca';\n\nexport const CHINESE_SCIENCE_MAR_2026_QUESTIONS: Question[] = `;
const tsContent = fileHeader + JSON.stringify(generatedQuestions, null, 2) + `;\n`;

fs.writeFileSync('src/data/papers/chineseScienceMar2026.ts', tsContent, 'utf8');
console.log('Successfully written all 80 authentic questions into src/data/papers/chineseScienceMar2026.ts');
