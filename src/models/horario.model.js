import mongoose from "mongoose";

const horarioSchema = new mongoose.Schema({
  salao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salao",
    required: true
  },
  colaborador: {
    type: mongoose.Schema.Types.ObjectId, // Profissional
    ref: "Usuario",
    required: true
  },
  dias: [
    {
      type: Number,
      required: true, // Dias da semana (0 = Domingo, 6 = Sábado)
    }
  ],
  inicio: {
    type: String, // inicio do expediente"09:00"
    required: true
  },
  fim: {
    type: String, // fim do expediente "18:00"
    required: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Horario", horarioSchema);
