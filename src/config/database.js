const { Sequelize } = require('sequelize');
require('dotenv').config();

// Banco MySQL (no computador ou no TiDB Cloud).
// Na nuvem, coloque DB_SSL=true para usar conexão segura.
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: 'mysql',
        logging: false,
        dialectOptions: process.env.DB_SSL === 'true'
            ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
            : {},
    }
);

module.exports = sequelize;
