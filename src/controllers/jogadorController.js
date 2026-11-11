const Jogador = require('../models/jogador');

async function listar(req, res) {
    try {
        const jogadores = await Jogador.findAll({
            where: { id_cadastrador: req.usuario.id },
            order: [['createdAt', 'DESC']],
        });

        res.json(jogadores);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar jogadores',
            erro: erro.message,
        });
    }
}

async function cadastrar(req, res) {
    try {
        const nome_jogador = req.body.nome_jogador?.trim();
        if (!nome_jogador) {
            return res.status(400).json({ mensagem: 'Informe o nome do jogador' });
        }

        const jogador = await Jogador.create({
            nome_jogador,
            id_cadastrador: req.usuario.id,
        });

        res.status(201).json(jogador);
    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao cadastrar jogador',
            erro: erro.message,
        });
    }
}

async function excluir(req, res) {
    try {
        const jogador = await Jogador.findOne({
            where: {
                id_jogador: req.params.id,
                id_cadastrador: req.usuario.id,
            },
        });

        if (!jogador) {
            return res.status(404).json({ mensagem: 'Jogador não encontrado' });
        }

        await jogador.destroy();
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir jogador',
            erro: erro.message,
        });
    }
}

module.exports = { listar, cadastrar, excluir };
