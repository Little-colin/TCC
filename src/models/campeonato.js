const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campeonato = sequelize.define('Campeonato',{
      id_campeonato: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome_campeonato: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      max_times: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 16,
        validate: { min: 2 },
      },
      data_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      data_fim: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'ABERTO',
        validate: { isIn: [['ABERTO', 'EM_ANDAMENTO', 'FINALIZADO']] },
      },
      formato: {
        type: DataTypes.STRING(50),
        defaultValue: 'ELIMINATORIA',
      },

      // FK -> USUARIO(id_usuario)
      id_organizador: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
  );

module.exports = Campeonato;