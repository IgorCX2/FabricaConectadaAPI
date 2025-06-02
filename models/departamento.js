const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/usuarios');

const Departamento = sequelize.define('Departamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fabrica: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  centro_custo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  }
}, {
  tableName: 'departamentos',
  timestamps: false,
});
// sequelize.sync({ alter: true })
//     .then(() => {
//         console.log('Banco sincronizado!');
//     })
//     .catch((err) => {
//         console.error('Erro ao sincronizar:', err);
// });
// INSERT INTO departamentos (departamento, fabrica, centro_custo) values ('Manutencao', 'Fabrica 1', '700700'), ('Manutencao', 'Fabrica 1', '700701'), ('Manutencao', 'Fabrica 1', '700702'), ('Qualidade', 'Fabrica 1', '600636')

module.exports = Departamento;
