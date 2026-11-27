const express = require('express');
const sequelize = require('./config/database');
require('./config/associations');
const path = require('path');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
let bancoPronto;

function prepararBanco() {
    if (!bancoPronto) {
        bancoPronto = sequelize.authenticate().then(() => {
            if (!process.env.VERCEL) return sequelize.sync();
        });
    }
    return bancoPronto;
}

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use((req, res, next) => {
    prepararBanco().then(() => next()).catch(next);
});

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

if (require.main === module) {
    prepararBanco()
        .then(() => {
            console.log('Conectado ao banco de dados');
            app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
        })
        .catch(err => {
            console.error('Erro ao iniciar o servidor ou sincronizar o banco:', err);
            process.exitCode = 1;
        });
}

module.exports = app;