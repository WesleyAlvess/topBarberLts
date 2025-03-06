import mongoose from "mongoose";

const horarioSchema = new mongoose.Schema({
  salao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salao",
    required: true
  },
  dias: [
    {
      type: Number,
      required: true, // Dias da semana (0 = Domingo, 6 = Sábado)
    }
  ],
  horarios: [
    {
      hora: {
        type: String, // Exemplo: "09:00", "10:30", "14:00"
        required: true
      },
      disponivel: {
        type: Boolean,
        default: true // Indica se o horário está disponível para agendamento
      }
    }
  ],
  dataCadastro: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Horario", horarioSchema);
