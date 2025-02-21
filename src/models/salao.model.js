import mongoose from 'mongoose';

const salaoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true,
        },
        localizacao: {
            type: String,
            required: true,
            trim: true,
        },
        telefone: {
            type: String,
            required: true,
            trim: true,
        },
        servicos: [
            {
                type: String,
                required: true,
            },
        ],
        horario: {
            type: Map,
            of: String, 
            required: true,
        },
    },
    {
        timestamps: true, // Cria os campos `createdAt` e `updatedAt`
    }
);

const Salao = mongoose.model('Salao', salaoSchema);

export default Salao;
