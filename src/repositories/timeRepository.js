const sequelize = require('../config/database');
const Time = require('../models/time');
const Jogador = require('../models/jogador');
const TimeJogador = require('../models/timeJogador');

async function listarDoCapitao(idCapitao) {
    const times = await Time.findAll({
        where: { id_capitao: idCapitao },
        order: [['data_criacao', 'DESC']],
    });

    const idsTimes = times.map(time => time.id_time);
    const vinculos = idsTimes.length
        ? await TimeJogador.findAll({ where: { id_time: idsTimes } })
        : [];
    const idsJogadores = [...new Set(vinculos.map(vinculo => vinculo.id_jogador))];
    const jogadores = idsJogadores.length
        ? await Jogador.findAll({
            where: {
                id_jogador: idsJogadores,
                id_cadastrador: idCapitao,
            },
            attributes: ['id_jogador', 'nome_jogador'],
        })
        : [];
    const jogadoresPorId = new Map(
        jogadores.map(jogador => [jogador.id_jogador, jogador])
    );
    const jogadoresPorTime = new Map();

    for (const vinculo of vinculos) {
        const jogador = jogadoresPorId.get(vinculo.id_jogador);
        if (!jogador) continue;

        const lista = jogadoresPorTime.get(vinculo.id_time) || [];
        lista.push(jogador);
        jogadoresPorTime.set(vinculo.id_time, lista);
    }

    return times.map(time => ({
        ...time.toJSON(),
        jogadores: jogadoresPorTime.get(time.id_time) || [],
    }));
}

async function criarComJogadores(dados, idsJogadores, idCapitao) {
    const timeExistente = await Time.findOne({
        where: { tag_time: dados.tag_time },
    });
    if (timeExistente) {
        const erro = new Error('Já existe um time com esta tag');
        erro.status = 400;
        throw erro;
    }

    return sequelize.transaction(async transaction => {
        if (idsJogadores.length) {
            const jogadoresEncontrados = await Jogador.count({
                where: {
                    id_jogador: idsJogadores,
                    id_cadastrador: idCapitao,
                },
                transaction,
            });

            if (jogadoresEncontrados !== idsJogadores.length) {
                const erro = new Error('Um ou mais jogadores selecionados não foram encontrados');
                erro.status = 400;
                throw erro;
            }
        }

        const time = await Time.create({
            ...dados,
            id_capitao: idCapitao,
        }, { transaction });

        if (idsJogadores.length) {
            await TimeJogador.bulkCreate(
                idsJogadores.map(id_jogador => ({
                    id_time: time.id_time,
                    id_jogador,
                })),
                { transaction }
            );
        }

        return time;
    });
}

function buscarDoCapitao(idTime, idCapitao) {
    return Time.findOne({
        where: {
            id_time: idTime,
            id_capitao: idCapitao,
        },
    });
}

async function excluir(time) {
    await sequelize.transaction(async transaction => {
        await TimeJogador.destroy({
            where: { id_time: time.id_time },
            transaction,
        });
        await time.destroy({ transaction });
    });
}

module.exports = {
    listarDoCapitao,
    criarComJogadores,
    buscarDoCapitao,
    excluir,
};
