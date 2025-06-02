const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'componentes',
  'sa',
  'Ig@rCX2',
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
