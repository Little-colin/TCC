const Time = require('../models/time');
const Jogador = require('../models/jogador');
require('../config/associations');

async function listar(req, res) {
    try {
        const times = await Time.findAll({
            where: { id_capitao: req.usuario.id },
            include: [{ model: Jogador, as: 'jogadores', attributes: ['id_jogador', 'nome_jogador'], through: { attributes: [] } }],
            order: [['data_criacao', 'DESC']],
        });

        res.json(times);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar equipes',
            erro: erro.message,
        });
    }
}

async function cadastrar(req, res) {
    try {
        const { nome_time, tag_time, logo, jogadores = [] } = req.body;

        // Verifica se a tag já existe para evitar erro de constraint única estourando de forma genérica
        const timeExistente = await Time.findOne({ where: { tag_time } });
        if (timeExistente) {
            return res.status(400).json({
                mensagem: 'Já existe um time com esta tag',
            });
        }

        const time = await Time.create({
            nome_time,
            tag_time,
            logo,
            id_capitao: req.usuario.id,
        });

        // Liga os jogadores escolhidos (só os cadastrados por este usuário)
        if (Array.isArray(jogadores) && jogadores.length > 0) {
            const meusJogadores = await Jogador.findAll({
                where: { id_jogador: jogadores, id_cadastrador: req.usuario.id },
            });
            await time.setJogadores(meusJogadores);
        }

        res.status(201).json(time);
    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao cadastrar time',
            erro: erro.message,
        });
    }
}

async function excluir(req, res) {
    try {
        const time = await Time.findOne({
            where: {
                id_time: req.params.id,
                id_capitao: req.usuario.id,
            },
        });

        if (!time) {
            return res.status(404).json({ mensagem: 'Equipe não encontrada' });
        }

        await time.destroy();
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir equipe',
            erro: erro.message,
        });
    }
}

module.exports = { listar, cadastrar, excluir };