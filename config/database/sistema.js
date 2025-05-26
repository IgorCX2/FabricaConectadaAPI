const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'sistema',
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mssql',
    port: 1433,
    dialectOptions: {
      options: {
        encrypt: false,
        instanceName: 'FABRICACONECTADA',
      }
    },
    logging: false,
  }
);

module.exports = sequelize;
