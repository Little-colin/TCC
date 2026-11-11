const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogador = sequelize.define('Jogador', {
    id_jogador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_jogador: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    id_cadastrador: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'jogadores',
});

module.exports = Jogador;
