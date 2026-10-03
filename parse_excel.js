const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('Modelo_de_Dados_App_Bar_e_Aulas.xlsx');
console.log('Sheet Names:', workbook.SheetNames);

const output = {};
workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  output[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
});

fs.writeFileSync('parsed_model.json', JSON.stringify(output, null, 2));
console.log('Saved parsed_model.json successfully!');
