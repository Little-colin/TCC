const sequelize = require('../config/database');
const Jogador = require('../models/jogador');
const TimeJogador = require('../models/timeJogador');

function listarDoCadastrador(idCadastrador) {
    return Jogador.findAll({
        where: { id_cadastrador: idCadastrador },
        order: [['createdAt', 'DESC']],
    });
}

function criar(dados) {
    return Jogador.create(dados);
}

function buscarDoCadastrador(idJogador, idCadastrador) {
    return Jogador.findOne({
        where: {
            id_jogador: idJogador,
            id_cadastrador: idCadastrador,
        },
    });
}

async function excluir(jogador) {
    await sequelize.transaction(async transaction => {
        await TimeJogador.destroy({
            where: { id_jogador: jogador.id_jogador },
            transaction,
        });
        await jogador.destroy({ transaction });
    });
}

module.exports = {
    listarDoCadastrador,
    criar,
    buscarDoCadastrador,
    excluir,
};
