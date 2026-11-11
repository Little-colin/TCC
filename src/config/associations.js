const Time = require('../models/time');
const Jogador = require('../models/jogador');
const TimeJogador = require('../models/timeJogador');

Time.belongsToMany(Jogador, {
    through: TimeJogador,
    foreignKey: 'id_time',
    otherKey: 'id_jogador',
    as: 'jogadores',
    onDelete: 'CASCADE',
});

Jogador.belongsToMany(Time, {
    through: TimeJogador,
    foreignKey: 'id_jogador',
    otherKey: 'id_time',
    as: 'equipes',
    onDelete: 'CASCADE',
});
