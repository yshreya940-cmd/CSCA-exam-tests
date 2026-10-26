const fs = require('fs');

const zh = fs.readFileSync('extracted_physics_dec2025_zh.txt', 'utf8');
const en = fs.readFileSync('extracted_physics_dec2025_en.txt', 'utf8');

const zhPages = zh.split(/-- \d+ of \d+ --/);
const enPages = en.split(/-- \d+ of \d+ --/);

// Solution pages in ZH are pages 8 to 16 (index 7 to 15)
const zhSolText = zhPages.slice(7).join('\n');
const enSolText = enPages.slice(7).join('\n');

// Also question pages in ZH are pages 1 to 7 (index 0 to 6)
const zhQText = zhPages.slice(0, 7).join('\n');
const enQText = enPages.slice(0, 7).join('\n');

fs.writeFileSync('temp_zh_sol.txt', zhSolText);
fs.writeFileSync('temp_en_sol.txt', enSolText);
fs.writeFileSync('temp_zh_q.txt', zhQText);
fs.writeFileSync('temp_en_q.txt', enQText);

console.log('Saved split files');
