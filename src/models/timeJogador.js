const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeJogador = sequelize.define('TimeJogador', {
    id_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    id_jogador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, {
    tableName: 'time_jogadores',
    timestamps: false,
});

module.exports = TimeJogador;
