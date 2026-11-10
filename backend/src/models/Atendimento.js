const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Atendimento = sequelize.define('Atendimento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id',
    },
  },
  tipo_tranca: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tamanho: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  material: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  local_atendimento: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  data_desejada: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  horario_desejado: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimativa_valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('em_triagem', 'pendente_confirmação', 'confirmado_pelo_johnny', 'cancelado'),
    defaultValue: 'em_triagem',
  },
  data_atendimento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'atendimentos',
  timestamps: false,
});

module.exports = Atendimento;
