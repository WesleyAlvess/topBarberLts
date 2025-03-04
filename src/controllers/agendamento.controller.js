import Agendamento from "../models/agendamento.model.js"
import Servico from "../models/servico.model.js"
import Horario from "../models/horario.model.js"

export const createAgendamento = async (req, res) => {
  try {
    const { salaoId } = req.params; // Pegando o id do salão pela url
    const { servico, data } = req.body; // Pegando os dados do body
    const clienteId = req.usuario.id; // Pegando o id do cliente pelo token

    // Verificando se todos os dados estão preenchidos
    if(!servico || !data) {
      return res.status(400).json({ mensagem: "Preencha todos os campos!" })
    }

    // Buscar o serviço pelo nome dentro do salão
    const salaoEscolhido = await Servico.findOne({
      titulo: servico,
      salao: salaoId
    })

    // Verificar se o serviço existe
    if(!salaoEscolhido) {
      return res.status(400).json({ mensagem: "Serviço não encontrado nesse salão." })
    }

    // Verificar se o horário está dentro da agenda do salão
    const diaSemana = new Date(data).getDay() // 0 (Dom) até 6 (Sáb)
    const horarioSalao = await Horario.findOne({
      salao: salaoId,
      dias: diaSemana
    })

    if(!horarioSalao) {
      return res.status(400).json({ mensagem: "O salão não abre nesse dia." })
    }

    // Verificar se o horário está dentro do expediente
    const horaAgendada = new Date(data).toISOString().split('T')[1].slice(0, 5) // Formato HH:MM
    if(horaAgendada < horarioSalao.inicio || horaAgendada > horarioSalao.fim) {
      return res.status(400).json({ message: "Horário fora do expediente do salão." });
    } 

    // Verificar se o horário já está ocupado
    const existeAgendamento = await Agendamento.findOne({
      salao: salaoId,
      data
    })
    if(existeAgendamento) {
      return res.status(400).json({ message: "Esse horário já está agendado." });
    }

    // Criando o novo agendamento
    const novoAgendamento = new Agendamento({
      cliente: clienteId,
      salao: salaoId,
      servico: salaoEscolhido._id,
      data,
    })

    await novoAgendamento.save();

    return res.status(201).json(novoAgendamento);

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar agendamento", erro: err.message })
  }
}
