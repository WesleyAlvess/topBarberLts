import mongoose from "mongoose";

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  salao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salao',
    required: true,
  },
  servico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
  },
  data: {
    type: String, // Exemplo: "2021-12-31"
    required: true,
  },
  horario: {
    type: String, // Exemplo: "14:00"
    required: true,
  },
  cancelado: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'cancelado'],
    default: 'pendente',
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  }
})

export default mongoose.model('Agendamento', agendamentoSchema)
