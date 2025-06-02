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
// insert into menus (nomeMenu, cor, departamentos, descricao) values ('Ordens de Manutenção','#FFB6C1','manutencao','Acompanhe e abra as solicitações de manutenção'), ('Ordens de Manutenção','#FFB6C1','manutencao','Acompanhe e abra as solicitações de manutenção'),('Inspeções','#FDFD96','qualidade','Veja o local e situação das inpeções de rotina da planta'),('Reparos','#4ECDC4','manutencao','Veja e gerencie os reparos externos'),('Solicitação de login','#FF9F1C','sistema','Gerencie os acesso ao seu time')
module.exports = Menu;
// insert into menus (nomeMenu, cor, departamentos, descricao) values 
// ('Ordens de Manutenção','#FF6B6B','manutencao','Acompanhe e abra as solicitações de manutenção'), 
// ('Inspeções','#FFD93D','qualidade','Veja o local e situação das inpeções de rotina da planta'),
// ('Reparos','#4ECDC4','manutencao','Veja e gerencie os reparos externos'),
// ('Solicitação de login','#FF9F1C','sistema','Gerencie os acesso ao seu time')
