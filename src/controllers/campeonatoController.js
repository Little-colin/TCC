const Campeonato = require('../models/campeonato');

async function listar(req, res) {
    try {
        const campeonatos = await Campeonato.findAll({
            where: { id_organizador: req.usuario.id },
            order: [['createdAt', 'DESC']],
        });

        res.json(campeonatos);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar campeonatos',
            erro: erro.message,
        });
    }
}

async function cadastrar(req, res) {
    try {
        const { 
            nome_campeonato, 
            descricao, 
            max_times, 
            data_inicio, 
            data_fim, 
            status, 
            formato,
        } = req.body;

        const campeonato = await Campeonato.create({
            nome_campeonato,
            descricao,
            max_times,
            data_inicio,
            data_fim,
            status,
            formato,
            id_organizador: req.usuario.id,
        });

        res.status(201).json(campeonato);
    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao cadastrar campeonato',
            erro: erro.message,
        });
    }
}

async function excluir(req, res) {
    try {
        const campeonato = await Campeonato.findOne({
            where: {
                id_campeonato: req.params.id,
                id_organizador: req.usuario.id,
            },
        });

        if (!campeonato) {
            return res.status(404).json({ mensagem: 'Campeonato não encontrado' });
        }

        await campeonato.destroy();
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir campeonato',
            erro: erro.message,
        });
    }
}

module.exports = { listar, cadastrar, excluir };