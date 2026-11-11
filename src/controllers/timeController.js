const timeRepository = require('../repositories/timeRepository');

async function listar(req, res) {
    try {
        const times = await timeRepository.listarDoCapitao(req.usuario.id);
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
        const idsJogadores = req.body.ids_jogadores ?? [];

        if (!Array.isArray(idsJogadores) ||
            idsJogadores.some(id => !Number.isInteger(id) || id < 1) ||
            new Set(idsJogadores).size !== idsJogadores.length) {
            return res.status(400).json({
                mensagem: 'A seleção de jogadores é inválida',
            });
        }

        const time = await timeRepository.criarComJogadores(
            { nome_time, tag_time, logo },
            idsJogadores,
            req.usuario.id
        );

        res.status(201).json({
            ...time.toJSON(),
            ids_jogadores: idsJogadores,
        });
    } catch (erro) {
        res.status(erro.status || 400).json({
            mensagem: 'Erro ao cadastrar time',
            erro: erro.message,
        });
    }
}

async function excluir(req, res) {
    try {
        const time = await timeRepository.buscarDoCapitao(req.params.id, req.usuario.id);

        if (!time) {
            return res.status(404).json({ mensagem: 'Equipe não encontrada' });
        }

        await timeRepository.excluir(time);
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir equipe',
            erro: erro.message,
        });
    }
}

module.exports = { listar, cadastrar, excluir };