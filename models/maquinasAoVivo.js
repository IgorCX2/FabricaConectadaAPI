const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/componentes');

const StatusAoVivo = sequelize.define('StatusAoVivo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    resourcecode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rscode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userstartedstatus: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    wohdcode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prodcode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rscomment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    supLevel2Code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'StatusAoVivo',
    timestamps: false,
});
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Banco sincronizado!');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar:', err);
    });
module.exports = StatusAoVivo;