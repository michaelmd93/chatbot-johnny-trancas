const { sequelize } = require('../config/database');
const Cliente = require('./Cliente');
const Atendimento = require('./Atendimento');
const Mensagem = require('./Mensagem');

// Definir relacionamentos
Cliente.hasMany(Atendimento, {
  foreignKey: 'cliente_id',
  as: 'atendimentos',
});

Atendimento.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente',
});

Atendimento.hasMany(Mensagem, {
  foreignKey: 'atendimento_id',
  as: 'mensagens',
});

Mensagem.belongsTo(Atendimento, {
  foreignKey: 'atendimento_id',
  as: 'atendimento',
});

module.exports = {
  sequelize,
  Cliente,
  Atendimento,
  Mensagem,
};
