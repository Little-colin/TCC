const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Time = sequelize.define('Time',{
    id_time: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome_time: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    tag_time: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    id_capitao: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    }
);

module.exports = Time;