const express = require('express');
const sequelize = require('./config/database');
const path = require('path');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Olá do Node.js na Vercel!');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
const campeonatoRoutes = require('./routes/campeonatoRoutes');
const jogadorRoutes = require('./routes/jogadorRoutes');

app.use(usuarioRoutes);
app.use(authRoutes);
app.use(campeonatoRoutes);
app.use(timeRoutes);
app.use(jogadorRoutes);

sequelize
    .authenticate()
    .then(() => {
        console.log('Conectado ao banco de dados');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch(err => {
        console.error('Erro ao iniciar o servidor ou sincronizar o banco:', err);
        process.exitCode = 1;
    });