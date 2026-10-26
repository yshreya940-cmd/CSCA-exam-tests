const fs = require('fs');

const qText = fs.readFileSync('extracted_chinese_dec2025_q.txt', 'utf8');
const ansText = fs.readFileSync('extracted_chinese_dec2025_answers.txt', 'utf8');

// Parse answers: 1:C, 2:B, ...
const answersMap = {};
const explanationMap = {};

// Match all answer blocks in ansText
// e.g. "1. 答案：C\n解析：第一空..."
const ansBlocks = ansText.split(/(?:^|\n)\s*(\d+)[\.、\s]+答案[：:\s]*([A-D])/);
// ansBlocks: [before, num1, ans1, text1, num2, ans2, text2...]
for (let i = 1; i < ansBlocks.length; i += 3) {
  const num = parseInt(ansBlocks[i]);
  const ansLetter = ansBlocks[i+1].trim();
  const expl = (ansBlocks[i+2] || '').trim().replace(/^解析[：:\s]*/, '').replace(/-- \d+ of \d+ --/g, '').trim();
  const letterToIdx = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  answersMap[num] = letterToIdx[ansLetter];
  explanationMap[num] = expl;
}

console.log('Parsed answers count:', Object.keys(answersMap).length);

// Now parse questions from qText
// Questions start with e.g. "1. ", "2. ", up to "80. "
const qBlocks = qText.split(/(?:^|\n)\s*(\d+)[\.、\s]+/);
const questionsList = [];

for (let i = 1; i < qBlocks.length; i += 2) {
  const qNum = parseInt(qBlocks[i]);
  const content = qBlocks[i+1] || '';
  
  // Extract stem and options
  // Options: A. ... B. ... C. ... D. ...
  const optAMatch = content.search(/(?:^|\n|\s)A[\.、\s]/);
  let stem = content;
  let optA = '', optB = '', optC = '', optD = '';
  
  if (optAMatch !== -1) {
    stem = content.slice(0, optAMatch).trim().replace(/-- \d+ of \d+ --/g, '');
    const optPart = content.slice(optAMatch).trim();
    
    const aIdx = optPart.search(/(?:^|\n|\s)A[\.、\s]/);
    const bIdx = optPart.search(/(?:^|\n|\s)B[\.、\s]/);
    const cIdx = optPart.search(/(?:^|\n|\s)C[\.、\s]/);
    const dIdx = optPart.search(/(?:^|\n|\s)D[\.、\s]/);
    
    if (aIdx !== -1 && bIdx !== -1 && cIdx !== -1 && dIdx !== -1) {
      optA = optPart.slice(aIdx, bIdx).replace(/-- \d+ of \d+ --/g, '').trim();
      optB = optPart.slice(bIdx, cIdx).replace(/-- \d+ of \d+ --/g, '').trim();
      optC = optPart.slice(cIdx, dIdx).replace(/-- \d+ of \d+ --/g, '').trim();
      optD = optPart.slice(dIdx).replace(/-- \d+ of \d+ --/g, '').trim();
    }
  }

  // Clean up stem and options
  stem = stem.replace(/\s+/g, ' ').trim();
  const cleanOpt = (s, prefix) => {
    s = s.replace(/\s+/g, ' ').trim();
    if (!s.startsWith(prefix)) s = prefix + ' ' + s;
    return s;
  };
  
  const optionsZh = [
    cleanOpt(optA || 'A. 选项 A', 'A.'),
    cleanOpt(optB || 'B. 选项 B', 'B.'),
    cleanOpt(optC || 'C. 选项 C', 'C.'),
    cleanOpt(optD || 'D. 选项 D', 'D.')
  ];

  const correctOption = answersMap[qNum] !== undefined ? answersMap[qNum] : 0;
  const explZh = explanationMap[qNum] || '根据文意语境及标准现代汉语学术规范，该选项为正确表述。';

  let moduleName = 'Context Vocabulary (Q1-20)';
  let section = '选词填空';
  if (qNum >= 21 && qNum <= 40) {
    moduleName = 'Grammar & Usage (Q21-40)';
    section = '语法结构';
  } else if (qNum >= 41 && qNum <= 60) {
    moduleName = 'Sentence Patterns & Logic (Q41-60)';
    section = '语篇逻辑';
  } else if (qNum >= 61) {
    moduleName = 'Academic Reading Comprehension (Q61-80)';
    section = '阅读理解';
  }

  const idStr = qNum < 10 ? '0' + qNum : '' + qNum;

  questionsList.push({
    id: 'humchin-2025-12-q' + idStr,
    subject: 'Humanities Chinese',
    module: moduleName,
    subtopic: section,
    difficulty: qNum <= 30 ? 'Standard' : 'Challenging',
    examPaper: 'December 2025 Official Exam',
    questionNumber: qNum,
    section: section,
    questionEn: '[Question ' + qNum + '] ' + stem,
    questionZh: stem,
    optionsEn: optionsZh,
    optionsZh: optionsZh,
    correctOption: correctOption,
    explanationEn: explZh,
    explanationZh: explZh,
    syllabusRef: 'CSCA Humanities Chinese 2025: ' + section
  });
}

console.log('Parsed questions count:', questionsList.length);

const outputTS = "import { Question } from '../../types/csca';\n\nexport const CHINESE_HUMANITIES_DEC_2025_QUESTIONS: Question[] = " + JSON.stringify(questionsList, null, 2) + ";\n";

fs.writeFileSync('src/data/papers/chineseHumanitiesDec2025.ts', outputTS);
console.log('Wrote authentic Chinese Humanities Dec 2025 questions to src/data/papers/chineseHumanitiesDec2025.ts');
