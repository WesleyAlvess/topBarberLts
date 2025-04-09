import mongoose from "mongoose";

const horarioSchema = new mongoose.Schema({
  salao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salao",
    required: true
  },
  dias: [
    {
      dia: {
        type: Number, // 0 (Domingo) a 6 (Sábado)
        required: true
      },
      fechado: {
        type: Boolean,
        required: false // Define se o salão/barbeiro estará fechado nesse dia
      },
      horarios: [
        {
          hora: {
            type: String, // Exemplo: "09:00"
            required: true
          },
          disponivel: {
            type: Boolean,
            default: true
          }
        }
      ]
    }
  ],

  dataCadastro: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Horario", horarioSchema);
