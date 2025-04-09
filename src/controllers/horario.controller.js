import Horario from '../models/horario.model.js'
import mongoose from 'mongoose';


// Criando Horário do salão
export const createHorario = async (req, res) => {
  try {
    const { salaoId } = req.params; // Pega o ID do salão da URL
    const { dias } = req.body; // Pega os dados do Body

    // Verifica se os campos estão vazios
    if (!dias || !dias.length === 0) {
      return res.status(400).json({ message: "Preencha todos os dias com os horários!" });
    }

    // Verifica se já existe um horário cadastrado para esse salão
    const horarioExistente = await Horario.findOne({ salao: salaoId })

    if (horarioExistente) {
      return res.status(400).json({ message: "Horários já cadastrados para esse salão!" });
    }

    // Cria um novo horário
    const novoHorario = await Horario.create({
      salao: salaoId,
      dias: dias.map(d => ({
        dia: d.dia,
        fechado: d.fechado || false,
        horarios: d.horarios || []
      }))
    })

    return res.status(201).json(novoHorario); // Retorna o novo horário criado


  } catch (err) {
    console.error("Erro ao criar horário:", err);
    return res.status(500).json({ mensagem: "Erro ao criar horário", err });
  }
}

// Listando Horários
export const getHorarios = async (req, res) => {
  try {
    const { salaoId } = req.params; // Pega o ID do salão da URL

    // Verifica se o ID é válido
    if (!salaoId) {
      return res.status(400).json({ message: "ID do salão não fornecido!" });
    }

    //Busca todos os horários cadastrados para o salão
    const horarios = await Horario.find({ salao: salaoId }).populate('salao', 'nome');

    return res.status(200).json(horarios); // Retorna os horários

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao Listar Horários", err });
  }
}

// Atualizar Horário
export const updateHorario = async (req, res) => {
  try {
    const { salaoId, id } = req.params; // Pegando os IDs do Salão e do Horário
    const { dias } = req.body; // Pegando os dados do corpo da requisição

    // Verifica se os campos estão vazios
    if (!dias || !dias.length === 0) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    // Busca o horário no banco de dados
    const horarioAtualizado = await Horario.findByIdAndUpdate(
      // Condição de busca
      {
        _id: id, // ID do horário
        salao: salaoId, // ID do salão
      },
      // Novos valores
      {
        dias,
      },
      // Retorna o documento atualizado
      {
        new: true,
      }
    )

    // Verifica se o horário foi encontrado
    if (!horarioAtualizado) {
      return res.status(404).json({ message: "Horário não encontrado!" });
    }

    // Resposta da request
    return res.status(200).json(horarioAtualizado);

  } catch (err) {
    console.error("Erro ao atualizar horário:", err);
    return res.status(500).json({ mensagem: "Erro ao atualizar horário", erro: err.message });
  }
}

// Deletar Horário
export const deleteHorario = async (req, res) => {
  try {
    const { salaoId, id } = req.params; // Pegando Ids do salão e do horário

    // Verifica se os IDs são válidos
    if (!mongoose.Types.ObjectId.isValid(salaoId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    // Verifica se o horário pertence ao salão correto e o deleta
    const horarioDeletado = await Horario.findOneAndDelete({
      _id: id,
      salao: salaoId,
    });

    // Verifica se o horário foi encontrado
    if (!horarioDeletado) {
      return res.status(404).json({ message: "Horário não encontrado!" });
    }

    return res.status(200).json({ message: "Horário deletado com sucesso!" });

  } catch (err) {
    console.error("Erro ao deletar horário:", err);
    return res.status(500).json({ mensagem: "Erro ao deletar horário", erro: err.message });
  }
};
