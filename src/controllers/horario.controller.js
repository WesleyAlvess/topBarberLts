import Horario from '../models/horario.model.js'

// Criando Horário
export const createHorario = async (req, res) => {
  try {
    const { salaoId } = req.params; // Pega o ID do salão da URL
    const colaboradorId = req.usuario.id; // Pega o ID do usuário logado
    const { dias, inicio, fim } = req.body; // Pega os dados do Body

    // Verifica se os campos estão vazios
    if ( !dias || !inicio || !fim) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    // Verifica se já existe horário para esse colaborador nos mesmos dias
    const horarioExistente = await Horario.findOne({
      salao: salaoId,
      colaborador: colaboradorId,
      dias,
      })
    if(horarioExistente) {
      return res.status(400).json({ mensagem: "Este profissional já possue horários cadastrados nesses dias" });
    }

    // Cria um novo horário.
    const novoHorario = await Horario.create({
      salao: salaoId, // Obtido da URL
      colaborador: colaboradorId, // Obtido automaticamente do token JWT
      dias,
      inicio,
      fim,
    })

    return res.status(201).json(novoHorario);

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar horário", err });
  }
}


// Listando Horários
export const getHorarios = async (req, res) => {
  try {
    const { salaoId } = req.params; // Pega o ID do salão da URL

    // Verifica se o ID é válido
    if(!salaoId) {
      return res.status(400).json({ message: "ID do salão não fornecido!" });
    }

    // Busca todos os horários do salão
    const horarios = await Horario.find({ salao: salaoId }).populate('colaborador', 'nome');

    return res.status(200).json(horarios); // Retorna os horários

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao Listar Horários", err });
  }
}


// Listando Horários por Colaborador
export const getHorariosPorColaborador = async (req, res) => {
  try {
    const { salaoId } = req.params;
  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar horário", err });
  }
}


// Atualizar Horário
export const updateHorario = async (req, res) => {
  try {
    const { salaoId } = req.params;
  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar horário", err });
  }
}


// Deletando Horário
export const deleteHorario = async (req, res) => {
  try {
    const { salaoId } = req.params;
  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar horário", err });
  }
}
