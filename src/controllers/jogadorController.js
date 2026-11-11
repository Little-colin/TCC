const jogadorRepository = require('../repositories/jogadorRepository');

async function listar(req, res) {
    try {
        const jogadores = await jogadorRepository.listarDoCadastrador(req.usuario.id);

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

        const jogador = await jogadorRepository.criar({
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
        const jogador = await jogadorRepository.buscarDoCadastrador(
            req.params.id,
            req.usuario.id
        );

        if (!jogador) {
            return res.status(404).json({ mensagem: 'Jogador não encontrado' });
        }

        await jogadorRepository.excluir(jogador);
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir jogador',
            erro: erro.message,
        });
    }
}

module.exports = { listar, cadastrar, excluir };
