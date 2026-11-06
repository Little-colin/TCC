import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import { autenticarToken } from './authMiddleware.js';

const app = express();
app.use(express.json());

// ==========================================
// 1. ROTAS PÚBLICAS (AUTENTICAÇÃO & CADASTRO)
// ==========================================

// Cadastro de Jogador (com Hash de Senha)
app.post('/api/auth/registro', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { nome, nickname, email, senha, foto_perfil } = req.body;

    if (!nome || !nickname || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes.' });
    }

    // Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `INSERT INTO USUARIO (nome, nickname, email, senha, foto_perfil) VALUES (?, ?, ?, ?, ?)`,
      [nome, nickname, email, senhaHash, foto_perfil || null]
    );

    const id_usuario = userResult.insertId;

    await connection.query(
      `INSERT INTO JOGADOR (id_jogador) VALUES (?)`,
      [id_usuario]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Jogador cadastrado com sucesso!',
      id_jogador: id_usuario
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
});

// Login do Usuário (Gera Token JWT)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await db.query(
      `SELECT id_usuario, nickname, email, senha FROM USUARIO WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const usuario = rows[0];

    // Compara senha enviada com o hash no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    // Gera o Token JWT contendo os dados básicos do usuário
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nickname: usuario.nickname },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nickname: usuario.nickname,
        email: usuario.email
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Rotas de leitura públicas
app.get('/api/jogadores', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id_usuario, u.nome, u.nickname, u.foto_perfil, j.ranking_pontos, j.total_vitorias, j.total_derrotas
      FROM USUARIO u
      INNER JOIN JOGADOR j ON u.id_usuario = j.id_jogador
    `);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/ranking/:temporada', async (req, res) => {
  try {
    const { temporada } = req.params;
    const [rows] = await db.query(
      `SELECT r.posicao, r.pontuacao, u.nickname, u.foto_perfil
       FROM RANKING r
       INNER JOIN JOGADOR j ON r.id_jogador = j.id_jogador
       INNER JOIN USUARIO u ON j.id_jogador = u.id_usuario
       WHERE r.temporada = ?
       ORDER BY r.pontuacao DESC`,
      [temporada]
    );
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. ROTAS PROTEGIDAS POR JWT (REQUER AUTENTICAÇÃO)
// ==========================================

// Criar Time (Usa o ID do usuário autenticado no token como capitão)
app.post('/api/times', autenticarToken, async (req, res) => {
  try {
    const { nome_time, tag_time, logo } = req.body;
    const id_capitao = req.usuario.id_usuario;

    const [result] = await db.query(
      `INSERT INTO TIME (nome_time, tag_time, logo, id_capitao) VALUES (?, ?, ?, ?)`,
      [nome_time, tag_time, logo || null, id_capitao]
    );

    await db.query(
      `INSERT INTO TIME_JOGADOR (id_time, id_jogador, e_reserva) VALUES (?, ?, FALSE)`,
      [result.insertId, id_capitao]
    );

    return res.status(201).json({ success: true, id_time: result.insertId, message: 'Time criado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Inscrever Time em Campeonato (Protegido)
app.post('/api/campeonatos/:id_campeonato/inscrever', autenticarToken, async (req, res) => {
  try {
    const { id_campeonato } = req.params;
    const { id_time } = req.body;

    const [result] = await db.query(
      `INSERT INTO INSCRICAO_CAMPEONATO (id_campeonato, id_time) VALUES (?, ?)`,
      [id_campeonato, id_time]
    );

    return res.status(201).json({ success: true, id_inscricao: result.insertId, status: 'PENDENTE' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Criar Campeonato (Protegido)
app.post('/api/campeonatos', autenticarToken, async (req, res) => {
  try {
    const { nome_campeonato, descricao, max_times, data_inicio, data_fim, formato } = req.body;
    const id_organizador = req.usuario.id_usuario;

    const [result] = await db.query(
      `INSERT INTO CAMPEONATO (nome_campeonato, descricao, max_times, data_inicio, data_fim, formato, id_organizador)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome_campeonato, descricao, max_times || 16, data_inicio, data_fim || null, formato || 'ELIMINATORIA', id_organizador]
    );

    return res.status(201).json({ success: true, id_campeonato: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Atualizar Resultado de Partida (Protegido)
app.patch('/api/partidas/:id_partida/resultado', autenticarToken, async (req, res) => {
  try {
    const { id_partida } = req.params;
    const { id_time_vencedor } = req.body;

    await db.query(
      `UPDATE PARTIDA SET id_time_vencedor = ?, status = 'FINALIZADA' WHERE id_partida = ?`,
      [id_time_vencedor, id_partida]
    );

    return res.json({ success: true, message: 'Resultado registrado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Rivals Arena rodando com JWT na porta ${PORT}`);
});