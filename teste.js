const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const StatusAoVivo = require('./models/maquinasAoVivo');

async function importarCSV(filePath) {
  const registros = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        // Converte campos conforme necessário
        if (row.qtd) row.qtd = parseInt(row.qtd);
        if (row.data_abertura) row.data_abertura = new Date(row.data_abertura);

        // Trata valores 'NULL' como null
        for (let key in row) {
          if (row[key] === 'NULL') row[key] = null;
        }

        registros.push(row);
      })
      .on('end', async () => {
        try {
          await StatusAoVivo.bulkCreate(registros);
          console.log('✅ Dados importados com sucesso!');
          resolve();
        } catch (err) {
          console.error('⛔ Erro ao salvar no banco:', err);
          reject(err);
        }
      })
      .on('error', reject);
  });
}

// Exemplo de uso:
importarCSV(path.join(__dirname, 'histoc.csv'));
