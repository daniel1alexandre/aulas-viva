const fs = require('fs');
const data = JSON.parse(fs.readFileSync('parsed_model.json'));

console.log('=== TABELAS_BAR ===');
const barRows = data['Tabelas_BAR'] || [];
console.log('Total rows:', barRows.length);
console.log('First 15 rows:');
barRows.slice(0, 15).forEach((r, i) => console.log(i, JSON.stringify(r)));

console.log('\n=== TABELAS_AULAS ===');
const aulasRows = data['Tabelas_AULAS'] || [];
console.log('Total rows:', aulasRows.length);
console.log('First 15 rows:');
aulasRows.slice(0, 15).forEach((r, i) => console.log(i, JSON.stringify(r)));

console.log('\n=== RELACIONAMENTOS ===');
const relRows = data['Relacionamentos'] || [];
console.log('Total rows:', relRows.length);
console.log('First 15 rows:');
relRows.slice(0, 15).forEach((r, i) => console.log(i, JSON.stringify(r)));

console.log('\n=== VALORES_ENUMERADOS ===');
const enumRows = data['Valores_Enumerados'] || [];
console.log('Total rows:', enumRows.length);
console.log('First 15 rows:');
enumRows.slice(0, 15).forEach((r, i) => console.log(i, JSON.stringify(r)));
