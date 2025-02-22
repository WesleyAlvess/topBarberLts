import mongoose from "mongoose";

const assinaturaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  tipoPlano: {
    type: String,
    enum: ["mensal"],
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["ativo", "cancelado"],
    default: "ativo"
  },
  transacoesId: {
    type: String,
    required: true, // ID da transação no Stripe ou Mercado Pago
  },
  dataInicio: {
    type: Date,
    default: Date.now
  },
  dataFim: {
    type: Date,
    required: true, // Data que expira a assinatura
  }
})

export default mongoose.model("Assinatura", assinaturaSchema);
