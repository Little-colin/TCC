const Campeonato = require('../models/campeonato');

function listarDoOrganizador(idOrganizador) {
    return Campeonato.findAll({
        where: { id_organizador: idOrganizador },
        order: [['createdAt', 'DESC']],
    });
}

function criar(dados) {
    return Campeonato.create(dados);
}

function buscarDoOrganizador(idCampeonato, idOrganizador) {
    return Campeonato.findOne({
        where: {
            id_campeonato: idCampeonato,
            id_organizador: idOrganizador,
        },
    });
}

function excluir(campeonato) {
    return campeonato.destroy();
}

module.exports = {
    listarDoOrganizador,
    criar,
    buscarDoOrganizador,
    excluir,
};
