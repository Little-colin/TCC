const Usuario = require('../models/Usuario');

function criar(dados) {
    return Usuario.create(dados);
}

function buscarPorEmail(email) {
    return Usuario.findOne({ where: { email } });
}

module.exports = { criar, buscarPorEmail };
