require('dotenv').config();

const sequelize = require('./config/database');
require('./config/associations');
const app = require('./app');

sequelize
    .authenticate()
    .then(() => {
        console.log('Conectado ao banco de dados');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
    })
    .catch(err => {
        console.error('Erro ao iniciar o servidor ou sincronizar o banco:', err);
        process.exitCode = 1;
    });
