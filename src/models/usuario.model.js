import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  senha: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
  },
  foto: {
    type: String,
    default: "",
  },
  tipo: {
    type: String,
    enum: ["cliente", "profissional"], // Diferencia cliente de profissional
    default: "cliente" // Todo mundo começa como cliente automaticamente
  },
  status: {
    type: String,
    enum: ["ativo"],
    default: "ativo",
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  }
})

export default mongoose.model("Usuario", usuarioSchema)
