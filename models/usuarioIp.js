const { DataTypes } = require('sequelize');
const bd = require('./bd');
const EmpresasUrl = require('./empresasUrls');
const UsuarioIp = bd.define('UsuarioIp', {
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    empresaId: {
        type: DataTypes.INTEGER,
        references: {
            model: EmpresasUrl,
            key: 'id'
        }
    }
});
EmpresasUrl.hasMany(UsuarioIp, { foreignKey: 'empresaId' });
UsuarioIp.belongsTo(EmpresasUrl, { foreignKey: 'empresaId' });
UsuarioIp.sync()
module.exports = UsuarioIp;