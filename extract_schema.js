const fs = require('fs');
const data = JSON.parse(fs.readFileSync('parsed_model.json'));

function parseTableRows(rows) {
  const header = rows[0];
  const tables = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const tableName = row[0];
    if (!tables[tableName]) tables[tableName] = [];
    tables[tableName].push({
      campo: row[1],
      tipo: row[2],
      pk_fk: row[3] || '',
      obrigatorio: row[4] || '',
      descricao: row[5] || ''
    });
  }
  return tables;
}

const barTables = parseTableRows(data['Tabelas_BAR']);
const aulasTables = parseTableRows(data['Tabelas_AULAS']);

const relRows = data['Relacionamentos'];
const rels = [];
for (let i = 1; i < relRows.length; i++) {
  const r = relRows[i];
  if (!r || !r[0]) continue;
  rels.push({
    de_tabela: r[0],
    de_campo: r[1],
    para_tabela: r[2],
    para_campo: r[3],
    tipo_relacao: r[4],
    descricao: r[5]
  });
}

const enumRows = data['Valores_Enumerados'];
const enums = [];
for (let i = 1; i < enumRows.length; i++) {
  const r = enumRows[i];
  if (!r || !r[0]) continue;
  enums.push({
    tabela: r[0],
    campo: r[1],
    valores: (r[2] || '').split(';').map(s => s.trim()),
    observacao: r[3] || ''
  });
}

const fullSchema = {
  barTables,
  aulasTables,
  relacionamentos: rels,
  valoresEnumerados: enums
};

fs.writeFileSync('full_schema_extracted.json', JSON.stringify(fullSchema, null, 2));
console.log('Bar Tables:', Object.keys(barTables));
console.log('Aulas Tables:', Object.keys(aulasTables));
console.log('Total Relationships:', rels.length);
console.log('Total Enums:', enums.length);
