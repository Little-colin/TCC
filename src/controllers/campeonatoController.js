const campeonatoRepository = require('../repositories/campeonatoRepository');

async function listar(req, res) {
    try {
        const campeonatos = await campeonatoRepository.listarDoOrganizador(req.usuario.id);

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

        const campeonato = await campeonatoRepository.criar({
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
        const campeonato = await campeonatoRepository.buscarDoOrganizador(
            req.params.id,
            req.usuario.id
        );

        if (!campeonato) {
            return res.status(404).json({ mensagem: 'Campeonato não encontrado' });
        }

        await campeonatoRepository.excluir(campeonato);
        res.status(204).end();
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir campeonato',
            erro: erro.message,
        });
    }
}

module.exports = { listar, cadastrar, excluir };