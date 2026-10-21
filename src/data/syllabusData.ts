import { SyllabusData } from '../types/csca';

export const OFFICIAL_SYLLABI: Record<string, SyllabusData> = {
  Mathematics: {
    subject: 'Mathematics',
    code: 'CSCA-MATH-2025',
    durationMinutes: 60,
    totalQuestions: 48,
    totalPoints: 100,
    languages: 'Chinese or English / 中文或英文',
    questionType: 'Multiple Choice (Single Answer) / 单项选择题',
    purposeEn: 'Assesses international students’ mastery of mathematical knowledge, with a particular focus on their fundamental mathematical skills, logical thinking ability, and problem-solving competence. It ensures students possess the academic foundation required for undergraduate studies at Chinese universities.',
    purposeZh: '考查国际学生对数学基础知识、基本技能的掌握程度，重点考查逻辑思维能力、运算求解能力和分析解决问题能力，为在中国高校攻读理工类及相关本科专业奠定坚实的数学基础。',
    modules: [
      {
        titleEn: 'Sets and Inequalities',
        titleZh: '集合与不等式',
        itemsEn: [
          'Definition, operations, and representation of sets (union, intersection, complement)',
          'Basic properties and solution methods of inequalities (quadratic inequalities, rational inequalities, absolute value inequalities)',
        ],
        itemsZh: [
          '集合的含义、表示及基本运算（并集、交集、补集）',
          '不等式的基本性质与求解方法（一元二次不等式、分式不等式、含绝对值不等式）',
        ],
      },
      {
        titleEn: 'Functions',
        titleZh: '函数与导数',
        itemsEn: [
          'Concepts and properties of functions (domain, range, monotonicity, parity/symmetry)',
          'Basic elementary functions (power, exponential, logarithmic, and trigonometric functions)',
          'Sequences (general term formula and summation of arithmetic and geometric sequences)',
          'Basics of derivatives and calculus (definition, geometric meaning of tangent lines, simple extremum applications)',
        ],
        itemsZh: [
          '函数的概念与性质（定义域、值域、单调性、奇偶性与周期性）',
          '基本初等函数（幂函数、指数函数、对数函数、三角函数）',
          '数列（等差数列与等比数列的通项公式与求和公式）',
          '导数及其应用（导数的几何意义、切线方程、函数的极值与最值简单应用）',
        ],
      },
      {
        titleEn: 'Geometry and Algebra',
        titleZh: '几何与代数',
        itemsEn: [
          'Plane analytic geometry (equations and properties of lines, circles, ellipses, hyperbolas, and parabolas)',
          'Vectors and complex numbers (vector operations, scalar products, basic operations of complex numbers)',
          'Solid geometry (rectangular coordinate system in space, volume and surface area properties of simple solids)',
        ],
        itemsZh: [
          '平面解析几何（直线方程、圆的方程、圆锥曲线：椭圆、双曲线、抛物线的标准方程与几何性质）',
          '平面向量与复数（向量的线性运算、数量积、复数的基本代数运算与模长）',
          '立体几何（空间直角坐标系、常见空间几何体的表面积与体积计算）',
        ],
      },
      {
        titleEn: 'Probability and Statistics',
        titleZh: '概率与统计',
        itemsEn: [
          'Classical probability model and probability calculation (permutations, combinations, independent events)',
          'Numerical characteristics of data (mean, variance, standard deviation)',
          'Basic concepts and standard normal distribution properties',
        ],
        itemsZh: [
          '古典概型与概率计算（排列组合计数原理、互斥事件与相互独立事件）',
          '样本数据的数字特征（平均数、方差、标准差）',
          '正态分布的基本概念及对称性应用',
        ],
      },
    ],
  },
  Physics: {
    subject: 'Physics',
    code: 'CSCA-PHYS-2025',
    durationMinutes: 60,
    totalQuestions: 48,
    totalPoints: 100,
    languages: 'Chinese or English / 中文或英文',
    questionType: 'Multiple Choice (Single Answer) / 单项选择题',
    purposeEn: 'Assesses core physics competencies required for international students to pursue undergraduate studies in science and engineering programs in China: mastery of fundamental physical knowledge, scientific thinking, and ability to apply knowledge across mechanical, electrical, and materials disciplines.',
    purposeZh: '考查国际学生在中国高校攻读理工类专业所需的物理核心素养，包括对物理学基础概念、基本定律的理解与跨学科应用能力，为机械、电气、材料等工程学科打下扎实基石。',
    modules: [
      {
        titleEn: 'Mechanics',
        titleZh: '力学',
        itemsEn: [
          'Kinematics: displacement, velocity, acceleration, uniform acceleration motion, free fall motion',
          'Newton’s laws of motion and their applications (equilibrium, friction, dynamics)',
          'Momentum and impulse, law of conservation of momentum',
          'Work and energy, kinetic energy theorem, law of conservation of mechanical energy',
          'Circular motion, centripetal acceleration, and universal gravitation (satellite orbital motion)',
          'Simple harmonic motion and mechanical wave propagation (frequency, wavelength, wave speed)',
        ],
        itemsZh: [
          '运动学：位移、速度、加速度、匀变速直线运动规律、自由落体运动',
          '牛顿运动定律及其应用（共点力平衡、摩擦力分析、动力学综合问题）',
          '动量与冲量、动量守恒定律及其碰撞应用',
          '功和能、动能定理、机械能守恒定律',
          '匀速圆周运动、向心力与万有引力定律（天体与人造卫星运动）',
          '简谐振动与机械波的传播特征（波速、波长与频率的关系）',
        ],
      },
      {
        titleEn: 'Electromagnetism',
        titleZh: '电磁学',
        itemsEn: [
          'Electrostatics: Coulomb’s law, electric field strength, electric potential, capacitance',
          'Direct current circuits: Ohm’s law, series and parallel circuits, electromotive force, electric power',
          'Magnetic field: magnetic induction, Ampere’s force, Lorentz force on charged particles',
          'Electromagnetic induction: Faraday’s law of induction, Lenz’s law, induced EMF',
        ],
        itemsZh: [
          '静电场：库仑定律、电场强度、电势差与电势能、电容器',
          '恒定电流：闭合电路欧姆定律、串并联电路、电动势与电功率',
          '磁场：磁感应强度、安培力、洛伦兹力及带电粒子在磁场中的偏转运动',
          '电磁感应：法拉第电磁感应定律、楞次定律、感应电动势计算',
        ],
      },
      {
        titleEn: 'Thermodynamics',
        titleZh: '热学',
        itemsEn: [
          'Kinetic theory of gases: molecular motion, temperature and internal energy',
          'Ideal gas equation of state (p-V-T relationships, Boyle-Mariotte and Gay-Lussac laws)',
          'First law of thermodynamics: heat, work, and changes in internal energy',
        ],
        itemsZh: [
          '气体分子动理论：分子热运动、温度与内能的微观解释',
          '理想气体状态方程（p-V-T状态参量关系、等温、等压、等容过程）',
          '热力学第一定律：热量、功与内能变化的转化与守恒',
        ],
      },
      {
        titleEn: 'Optics',
        titleZh: '光学',
        itemsEn: [
          'Geometrical optics: laws of reflection and refraction, refractive index, total internal reflection',
          'Physical optics: wave nature of light, interference (double-slit) and diffraction phenomena',
        ],
        itemsZh: [
          '几何光学：光的反射定律与折射定律、折射率、全反射现象及临界角',
          '物理光学：光的波动性、双缝干涉、薄膜干涉与衍射现象',
        ],
      },
      {
        titleEn: 'Modern Physics',
        titleZh: '近代物理',
        itemsEn: [
          'Photoelectric effect: photon energy equation, work function, stopping potential',
          'Atomic structure: Rutherford alpha scattering, Bohr hydrogen atom model, energy level transitions',
          'Fundamentals of nuclear physics: binding energy, radioactive decay (alpha, beta, gamma), half-life',
        ],
        itemsZh: [
          '光电效应：光子说、爱因斯坦光电效应方程、逸出功与遏止电压',
          '原子结构：卢瑟福α粒子散射实验、玻尔氢原子轨道模型与能级跃迁',
          '原子核物理：核反应方程式、结合能、质量亏损、放射性衰变与半衰期',
        ],
      },
    ],
  },
  Chemistry: {
    subject: 'Chemistry',
    code: 'CSCA-CHEM-2025',
    durationMinutes: 60,
    totalQuestions: 48,
    totalPoints: 100,
    languages: 'Chinese or English / 中文或英文',
    questionType: 'Multiple Choice (Single Answer) / 单项选择题',
    purposeEn: 'Assesses core chemistry competencies required for international students in science and engineering programs in China: understanding of fundamental chemical systems, scientific inquiry, solution stoichiometry, reaction equilibria, and industrial chemical engineering applications.',
    purposeZh: '考查国际学生进入中国高等院校攻读理工类专业所需的化学学科核心素养，检验对化学基本概念、物质变化规律、化学反应速率与平衡、以及化学实验探究与工业流程分析的掌握。',
    modules: [
      {
        titleEn: 'Basic Chemical Concepts and Calculations',
        titleZh: '基本化学概念与计算',
        itemsEn: [
          'Classification and state changes of matter (elements, compounds, mixtures, phase diagrams)',
          'Chemical notation and equation writing (stoichiometry, ionic equations)',
          'Solution concentration (molarity, mass fraction) and pH calculations',
          'Calculations involving amount of substance (mole concept, Avogadro constant, molar mass/volume)',
          'Application of the ideal gas law (PV = nRT) under standard and non-standard conditions',
        ],
        itemsZh: [
          '物质的分类与状态变化（单质、化合物、混合物及相变过程）',
          '化学用语与化学方程式书写（离子方程式与化学计量数配平）',
          '溶液浓度（物质的量浓度、质量分数）与溶液pH值计算',
          '物质的量的相关计算（摩尔概念、阿伏加德罗常数、摩尔质量与气体摩尔体积）',
          '理想气体状态方程（PV = nRT）在化学计算中的应用',
        ],
      },
      {
        titleEn: 'Properties and Reactions of Substances',
        titleZh: '物质的性质与反应',
        itemsEn: [
          'Properties of common inorganic substances (alkali metals, halogens, transition metal oxides, acids, bases, salts)',
          'Basic organic compounds (hydrocarbons: alkanes, alkenes, alkynes, benzene and derivatives: alcohols, acids, esters)',
          'Identification and balancing of redox reactions (oxidizing/reducing agents, oxidation states)',
          'Ionic reactions, precipitation rules, and ion identification testing methods',
        ],
        itemsZh: [
          '常见无机物的性质（碱金属、卤族元素、金属及其氧化物、酸碱盐之间的转化）',
          '常见有机化合物基础（烃类：烷烃、烯烃、苯及同系物；衍生物：乙醇、乙酸、酯类）',
          '氧化还原反应的本质、电子转移分析及氧化剂/还原剂判断',
          '离子反应条件、复分解沉淀规律及常见离子（Fe3+, Cl-, SO4 2-等）的检验方法',
        ],
      },
      {
        titleEn: 'Chemical Theories and Laws',
        titleZh: '化学基本理论与规律',
        itemsEn: [
          'Atomic structure and periodic law (electron configuration, periodicity of radius and electronegativity)',
          'Chemical bonds and intermolecular forces (ionic, covalent, metallic bonding, hydrogen bonding)',
          'Reaction rate and chemical equilibrium (Le Chatelier’s principle, equilibrium constant K)',
          'Theories of electrolyte solutions (ionization equilibrium of weak electrolytes, salt hydrolysis, buffer basics)',
        ],
        itemsZh: [
          '原子结构与元素周期律（核外电子排布规律、原子半径与电负性的周期性递变）',
          '化学键与分子间作用力（离子键、共价键、金属键与氢键对熔沸点的影响）',
          '化学反应速率与化学平衡（勒夏特列原理、平衡常数K计算与移动方向）',
          '电解质溶液理论（弱电解质电离平衡、盐类水解原理与沉淀溶解平衡Ksp）',
        ],
      },
      {
        titleEn: 'Chemical Experiments and Applications',
        titleZh: '化学实验与实际应用',
        itemsEn: [
          'Laboratory safety and use of standard apparatus (pipettes, burettes, volumetric flasks, distillation setup)',
          'Preparation and identification of common gases (O2, H2, CO2, Cl2, NH3)',
          'Methods for separation and purification of substances (filtration, crystallization, extraction, distillation)',
          'Analysis of industrial chemical processes (e.g., ammonia synthesis Haber process, chlor-alkali industry)',
        ],
        itemsZh: [
          '化学实验安全规范与常用仪器规格（容量瓶、滴定管、分液漏斗、冷凝管）',
          '常见气体的实验室制备、净化与收集检验（O2、CO2、Cl2、NH3等）',
          '物质的分离与提纯方法（过滤、结晶、萃取分液、蒸馏与分馏）',
          '工业生产流程分析（合成氨工业哈伯法、氯碱工业、接触法制硫酸原理）',
        ],
      },
    ],
  },
  'Science Chinese': {
    subject: 'Science Chinese',
    code: 'CSCA-SCICHIN-2025',
    durationMinutes: 90,
    totalQuestions: 80,
    totalPoints: 100,
    languages: 'Chinese / 简体中文',
    questionType: 'Multiple Choice (Single Answer) / 客观单项选择题',
    purposeEn: 'Assesses international students’ professional Chinese language proficiency required for undergraduate STEM studies in China. Evaluates scientific terminology, experimental discourse, data interpretation, and academic comprehension across mathematics, physics, and chemistry.',
    purposeZh: '评估来华留学生攻读中国普通高校理工类本科专业所需的专业汉语能力。考查基础数理概念（数学符号、物理定律、化学方程式、实验术语）、专业课程内容及数据图表解读与学术论文阅读能力。',
    modules: [
      {
        titleEn: 'Character Identification (Q1-10)',
        titleZh: '识解汉字（1-10题）',
        itemsEn: [
          'Polyphonic characters and pronunciations in science contexts (量, 调, 盛, 数)',
          'Scientific character orthography and radical semantic associations (熔, 沸, 析, 键)',
        ],
        itemsZh: [
          '多音字读音辨识与理科语境运用（如：测量/容量、调节/调查、盛放/盛开）',
          '根据拼音辨选汉字，形旁表义辨析（火/热相关字、部首结构）',
        ],
      },
      {
        titleEn: 'Vocabulary Completion (Q11-25)',
        titleZh: '选词填空（11-25题）',
        itemsEn: [
          'Common scientific verbs and operations (测量, 溶解, 过滤, 搅拌, 计算)',
          'Physical and chemical property descriptors (稳定, 透明, 导电, 易燃, 均匀)',
          'Experimental apparatus and parameters (装置, 变量, 结论, 试剂, 样本)',
        ],
        itemsZh: [
          '实验常用动作与操作术语（测量、分析、溶解、过滤、计算、搅拌）',
          '理科性质与状态表述（稳定、精确、透明、导电、密度、体积）',
          '科学实验变量与要素搭配（单一变量、实验装置、试剂标签、科学结论）',
        ],
      },
      {
        titleEn: 'Synonym & Antonym Analysis (Q26-33)',
        titleZh: '辨析词语（26-33题）',
        itemsEn: [
          'Scientific precise synonyms (准确-精确, 严格-严谨, 逐步-渐渐)',
          'Physical state antonyms (快-慢, 纯净-浑浊, 高-低, 上升-下降)',
        ],
        itemsZh: [
          '近义词细微语体辨析（准确/精确、严格/严谨、韧性/弹性、真实/客观）',
          '反义词对比（反应快/慢、水质纯净/浑浊、熔点高/低、上升/下降）',
        ],
      },
      {
        titleEn: 'Textual Cohesion & Cloze (Q34-48)',
        titleZh: '选词成段（34-48题）',
        itemsEn: [
          'Experimental procedural reports and data logging flow (观察, 记录, 验证, 推导)',
          'Physics and thermodynamics phenomena descriptions (气压, 沸点, 能量, 处于)',
          'Scientific inquiry and renewable energy themes (化石能源, 沉积, 污染, 课题)',
        ],
        itemsZh: [
          '实验报告与科学探究流程（仔细观察、准确记录、推导公式、验证结论）',
          '物理热学与天体运动段落填空（坐标位置、气压与沸点、热量传递）',
          '新能源与生态学科普语段（化石能源、生物沉积、环境污染、研究课题）',
        ],
      },
      {
        titleEn: 'Sentence Completion & Grammar (Q49-70)',
        titleZh: '补全语句（49-70题）',
        itemsEn: [
          'Resultative complements and action completion (做完, 做成, 做好)',
          'Comparative structures and scientific passive/disposal sentences (比, 对...有效, 把...保持下去)',
          'Scientific definition conventions and logical markers (所谓..., 统称为..., 与...有关)',
        ],
        itemsZh: [
          '动补结构与离合词正确语序（做完、洗个手、跑个步）',
          '比较句与把字句规范（坐高铁比坐飞机更方便、把严谨态度保持下去）',
          '科技语境固定表述（所谓偶数、统称为光波、与...有关系、实验表明）',
        ],
      },
      {
        titleEn: 'Scientific Reading Comprehension (Q71-80)',
        titleZh: '阅读理解（71-80题）',
        itemsEn: [
          'Laboratory safety guidelines and instrument operational manuals',
          'Thermodynamic heat transfer mechanisms (conduction, convection, radiation)',
          'Scientific apparatus specification plates and role of research laboratories',
        ],
        itemsZh: [
          '实验室安全规范、操作准则与数据真实性要求',
          '科学原理短文分析（水结冰的反常膨胀、热传递三途径、仪器铭牌参数）',
          '科学实验室对创新驱动、科研实践与人才培养的深远意义',
        ],
      },
    ],
  },
  'Humanities Chinese': {
    subject: 'Humanities Chinese',
    code: 'CSCA-HUMCHIN-2025',
    durationMinutes: 90,
    totalQuestions: 80,
    totalPoints: 100,
    languages: 'Chinese / 简体中文',
    questionType: 'Multiple Choice (Single Answer) / 客观单项选择题',
    purposeEn: 'Assesses the professional Chinese language proficiency required for international students pursuing undergraduate degrees in humanities, social sciences, law, education, history, arts, and business in Chinese universities.',
    purposeZh: '评估来华留学生攻读中国普通高校文科类本科专业（文学、历史、哲学、法学、社会学、艺术、经济学等）所需的专业汉语能力，涵盖人文社科核心词汇、篇章理解与学术语体表达。',
    modules: [
      {
        titleEn: 'Character Identification (Q1-10)',
        titleZh: '识解汉字（1-10题）',
        itemsEn: [
          'Pronunciation of polyphonic characters in humanities texts (长, 好, 还, 要)',
          'Homophones, radical semantics, and polysemous words (同/问, 白/百, 准, 发)',
        ],
        itemsZh: [
          '多音字读音判别（爱好/好事、归还/还在、要求/要是）',
          '汉字形义结合辨析（三点水部首、形声字规律、“发”字多义辨析）',
        ],
      },
      {
        titleEn: 'Vocabulary Completion (Q11-25)',
        titleZh: '选词填空（11-25题）',
        itemsEn: [
          'Common verbs and adjectives (缓解压力, 避免危险, 参观博物馆, 足够的空间)',
          'Culture, literature, and legal terminology (古典诗词, 传统书法, 合同条款, 实施政策)',
        ],
        itemsZh: [
          '高频动词与形容词搭配（缓解压力、避免危险、提高水平、美好的事物）',
          '文史与法律情境词汇（四大名著古典小说、中国书法传统艺术、阅读合同条款）',
        ],
      },
      {
        titleEn: 'Synonyms & Antonyms (Q26-33)',
        titleZh: '辨析词语（26-33题）',
        itemsEn: [
          'Humanities context synonyms (紧张-不安, 重视-关注, 保存-保留, 必须-务必)',
          'Abstract concept antonyms (成果-后果, 冷静-冲动, 放弃-坚持, 复杂-简单)',
        ],
        itemsZh: [
          '近义词语义侧重辨析（紧张/不安、重视/关注、重新/重做、必须/务必）',
          '反义词辨识（成果/后果、冷静/冲动、放弃/坚持、珍惜/浪费）',
        ],
      },
      {
        titleEn: 'Textual Cohesion & Paragraph Cloze (Q34-48)',
        titleZh: '选词成段（34-48题）',
        itemsEn: [
          'Social media, culture sharing, and communication spaces (记录生活, 真实可信, 交流空间)',
          'Cultural heritage, performing arts, and urban tourism (传承传统文化, 观众, 游览名胜)',
        ],
        itemsZh: [
          '现代社会与文化传播语段（记录生活、分享真实、跨越国界的交流空间）',
          '文娱与传统艺术评论（继承传统文化、拥有广泛观众、艺术表演形式）',
        ],
      },
      {
        titleEn: 'Sentence Structures & Conjunctions (Q49-70)',
        titleZh: '补全语句（49-70题）',
        itemsEn: [
          'Time emphatic structures, adverbials, and prepositional frames (是...的, 才, 对...重要)',
          'Progressive and multi-attribute order (不但...而且..., 站在门口笑的红衣女孩)',
          'Cultural and social idioms (开开心心, 难以忘记, 浪漫的情感, 游来游去)',
        ],
        itemsZh: [
          '重点句式与副词用法（“是……的”时间强调句、“才”表不容易、“对……重要”）',
          '多重定语与递进关联结构（递进复句“不但……也……”、定语从句层级）',
          '文化常识与熟语表达（李白诗歌的浪漫情怀、传统节日的庆祝方式、AABB重叠词）',
        ],
      },
      {
        titleEn: 'Humanities & Social Reading Comprehension (Q71-80)',
        titleZh: '阅读理解（71-80题）',
        itemsEn: [
          'Workplace interview guidelines and etiquette',
          'Green economy, environmental consciousness, and shared transit models',
          'Urban library and public cultural sanctuaries and community cohesion',
        ],
        itemsZh: [
          '职场沟通与面试注意事项（衣着礼貌、诚实回答要领）',
          '绿色经济发展与现代共享出行生活方式的优势',
          '城市书房的社会文化价值（提供安静阅读空间、促进城市文化传播）',
        ],
      },
    ],
  },
  'Chinese': {
    subject: 'Chinese',
    code: 'CSCA-CHIN-2025',
    durationMinutes: 90,
    totalQuestions: 80,
    totalPoints: 100,
    languages: 'Chinese / 简体中文',
    questionType: 'Multiple Choice (Single Answer) / 客观单项选择题',
    purposeEn: 'Comprehensive examination covering both Science Chinese (STEM terminology and scientific discourse) and Humanities Chinese (academic literature, social analysis, and cultural expressions).',
    purposeZh: '全面考查国际学生的专业汉语能力，整合涵盖理科中文（数理化科技术语与实验表达）与文科中文（文化、历史、法律、社科学术语篇）。',
    modules: [
      {
        titleEn: 'STEM & Academic Chinese Terminology',
        titleZh: '专业学术术语与语法规范',
        itemsEn: [
          'Science & engineering terms, mathematical representations, chemical names',
          'Formal connectors and syntactical frameworks for university study',
        ],
        itemsZh: [
          '数理化专业术语与符号汉语规范表述',
          '学术汉语语法句式、把字句、比较句与语体辨析',
        ],
      },
      {
        titleEn: 'Academic & Professional Reading',
        titleZh: '学术文献与专业阅读理解',
        itemsEn: [
          'Scientific experiment reports, methodology, laboratory safety',
          'Humanities and social science academic passages and argumentative essays',
        ],
        itemsZh: [
          '自然科学与工程实验报告及数据分析阅读',
          '人文社科论文、社会观察与文化评论多篇章综合理解',
        ],
      },
    ],
  },
  'Professional Chinese': {
    subject: 'Chinese',
    code: 'CSCA-CHIN-2025',
    durationMinutes: 90,
    totalQuestions: 80,
    totalPoints: 100,
    languages: 'Chinese / 简体中文',
    questionType: 'Multiple Choice (Single Answer) / 客观单项选择题',
    purposeEn: 'Comprehensive examination covering both Science Chinese (STEM terminology and scientific discourse) and Humanities Chinese (academic literature, social analysis, and cultural expressions).',
    purposeZh: '全面考查国际学生的专业汉语能力，整合涵盖理科中文（数理化科技术语与实验表达）与文科中文（文化、历史、法律、社科学术语篇）。',
    modules: [
      {
        titleEn: 'STEM & Academic Chinese Terminology',
        titleZh: '专业学术术语与语法规范',
        itemsEn: [
          'Science & engineering terms, mathematical representations, chemical names',
          'Formal connectors and syntactical frameworks for university study',
        ],
        itemsZh: [
          '数理化专业术语与符号汉语规范表述',
          '学术汉语语法句式、把字句、比较句与语体辨析',
        ],
      },
      {
        titleEn: 'Academic & Professional Reading',
        titleZh: '学术文献与专业阅读理解',
        itemsEn: [
          'Scientific experiment reports, methodology, laboratory safety',
          'Humanities and social science academic passages and argumentative essays',
        ],
        itemsZh: [
          '自然科学与工程实验报告及数据分析阅读',
          '人文社科论文、社会观察与文化评论多篇章综合理解',
        ],
      },
    ],
  },
};
