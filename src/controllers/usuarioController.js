const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const Usuario = require('../models/Usuario');

async function cadastrar(req, res) {
  try {
    const { nome, email, senha} = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });
  } catch (erro) {
    if (erro instanceof UniqueConstraintError) {
      return res.status(409).json({
        mensagem: 'Este email já está cadastrado. Faça login ou use outro email.',
      });
    }

    console.error('Erro ao cadastrar usuário:', {
      name: erro.name,
      code: erro.original && erro.original.code,
    });
    return res.status(500).json({
      mensagem: 'Não foi possível cadastrar o usuário. Tente novamente mais tarde.',
    });
  }
}

module.exports = { cadastrar };