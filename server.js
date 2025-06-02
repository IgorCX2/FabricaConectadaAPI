require('dotenv').config();
const app = require('./app');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3001;

// setInterval(() => {
//   console.log(`[${new Date().toISOString()}] Executando script Python...`);

//   exec('python tarefa.py', (err, stdout, stderr) => {
//     if (err) return console.error(`Erro: ${err.message}`);
//     if (stderr) return console.error(`stderr: ${stderr}`);
//     console.log(`stdout: ${stdout}`);
//   });

// }, 5 * 60 * 1000);


app.listen(PORT, () => {
  console.log(`🟢 API Server port:${PORT} 🟢`);
});