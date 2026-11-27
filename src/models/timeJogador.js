const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabela de ligação entre equipes e jogadores (uma equipe tem vários jogadores)
const TimeJogador = sequelize.define('TimeJogador', {
    id_time: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_jogador: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    tableName: 'time_jogadores',
    timestamps: false,
});

module.exports = TimeJogador;
