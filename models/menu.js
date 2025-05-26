const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/sistema');

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nomeMenu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departamentos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'menus',
  timestamps: false,
});
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco sincronizado!');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar:', err);
});
module.exports = Menu;
