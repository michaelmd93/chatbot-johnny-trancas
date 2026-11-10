const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mensagem = sequelize.define('Mensagem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  atendimento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'atendimentos',
      key: 'id',
    },
  },
  remetente: {
    type: DataTypes.ENUM('cliente', 'bot'),
    allowNull: false,
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  data_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'mensagens',
  timestamps: false,
});

module.exports = Mensagem;
