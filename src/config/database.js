const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        dialectModule: mysql2,
        // Bancos na nuvem (ex.: TiDB Cloud) exigem conexão segura (SSL).
        // Liga o SSL só quando a variável DB_SSL=true estiver configurada.
        dialectOptions: process.env.DB_SSL === 'true'
            ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
            : {},
    }
);

module.exports = sequelize;