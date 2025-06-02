const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/sistema');

const Turno = sequelize.define('Turno', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  turno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inicio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'turnos',
  timestamps: false,
});
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco sincronizado!');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar:', err);
});
module.exports = Turno;
