const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/usuarios');

const Cargo = sequelize.define('Cargo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsavel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'cargos',
  timestamps: false,
});
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Banco sincronizado!');
//   })
//   .catch((err) => {
//     console.error('Erro ao sincronizar:', err);
// });
module.exports = Cargo;
