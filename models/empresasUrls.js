const { Sequelize } = require('sequelize');
const bd = require('./bd');
const { DataTypes } = require('sequelize');

const EmpresasUrl = bd.define('EmpresasUrl', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
      },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
EmpresasUrl.sync()
module.exports = EmpresasUrl;