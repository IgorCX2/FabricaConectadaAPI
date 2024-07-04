const fs = require('fs');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.Name, process.env.User, process.env.Password, {
  host: process.env.Host,
  port: process.env.Port,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  dialectOptions:{
    ssl:{
      ca: fs.readFileSync(process.env.DB_SSL_CA).toString(),
      key: fs.readFileSync(process.env.DB_SSL_KEY).toString(),
      cert: fs.readFileSync(process.env.DB_SSL_CERT).toString(),
    }
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  },
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});
sequelize.authenticate()
.then(()=>{
  console.log("Autenticado!");
}).catch((error)=>{
  console.log("Erro no banco de dados! Tente atualizar a pagina ou entre em contato com o suporte"+ error);
});
module.exports = sequelize;