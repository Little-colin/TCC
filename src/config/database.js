const { Sequelize } = require('sequelize');
require('dotenv').config();

const ssl = { require: true, rejectUnauthorized: false };
const connectionString = process.env.DATABASE_URL;

const sequelize = connectionString
    ? new Sequelize(connectionString, {
        dialect: 'postgres',
        dialectOptions: { ssl },
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 5432),
            dialect: 'postgres',
            dialectOptions: process.env.DB_SSL === 'true' ? { ssl } : {},
        }
    );

module.exports = sequelize;