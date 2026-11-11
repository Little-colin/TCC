const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuarioRepository');

async function cadastrar(req, res) {
  try {
    const { nome, email, senha} = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await usuarioRepository.criar({
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
    res.status(400).json({
      mensagem: 'Erro ao cadastrar usuário',
      erro: erro.message,
    });
  }
}

module.exports = { cadastrar };