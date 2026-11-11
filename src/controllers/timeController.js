const Time = require('../models/time');

async function listar(req, res) {
    try {
        const times = await Time.findAll({
            where: { id_capitao: req.usuario.id },
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
        const { nome_time, tag_time, logo } = req.body;

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