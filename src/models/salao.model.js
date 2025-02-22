import mongoose from 'mongoose';

const salaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true,
    },
    dono: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    endereco: {
        type: String,
        required: true,
    },
    servicos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Servico',
        },
    ],
    dataCadastro: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Salao', salaoSchema)
