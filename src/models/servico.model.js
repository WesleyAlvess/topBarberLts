import mongoose from "mongoose";

const servicoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  duracao: {
    type: Number,
    required: true,
  },
  salao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salao',
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  }
})

export default mongoose.model('Servico', servicoSchema)
