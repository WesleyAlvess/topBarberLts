import mongoose from "mongoose";

const agendamentoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'pendente',
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  }
})

export default mongoose.model('Agendamento', agendamentoSchema)
