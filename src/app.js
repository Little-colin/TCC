
const express = require('express');
const sequelize = require('./config/database');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'public', 'index.html')
    );
});

// Rotas
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

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados');

        await sequelize.sync();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar aplicação:', error);
        process.exit(1);
    }
}

iniciarServidor();

module.exports = app;