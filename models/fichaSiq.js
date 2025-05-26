const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/componentes');

const fichaSiq = sequelize.define('fichaSiq', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    resourcecode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wohdcode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prodcode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userstartedstatus: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    planta: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    data_abertura: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    liberacao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    t01: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    f01: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    qtd: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    supLevel2Code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    turno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comprovante: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'fichaSiq',
    timestamps: false,
});
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco sincronizado!');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar:', err);
});
module.exports = fichaSiq;