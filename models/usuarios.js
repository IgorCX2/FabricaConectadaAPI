const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/usuarios');
const Cargo = require('./cargo');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  codigo_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plantaPrincipal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  data_atualizacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  perm: {
    type: DataTypes.STRING,
    defaultValue: '1',
  },
  perm_especial: {
    type: DataTypes.STRING,
    defaultValue: '1',
  },
  perm_suprema: {
    type: DataTypes.STRING,
    defaultValue: '1',
  },
  turno:{
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
});

Usuario.belongsTo(Cargo, { foreignKey: 'cargo_id', as: 'cargo' });
Cargo.hasMany(Usuario, { foreignKey: 'cargo_id', as: 'usuarios' });
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco sincronizado!');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar:', err);
});
module.exports = Usuario;