const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/componentes');

const itemsPecas = sequelize.define('itemsPecas', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itemFabrica: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    itemFinal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cavidade: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    tempoMedio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alerta: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    siq: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    tableName: 'itemsPecas',
    timestamps: false,
});
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco sincronizado!');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar:', err);
});
module.exports = itemsPecas;