import Agendamento from "../models/agendamento.model.js"
import Servico from "../models/servico.model.js"
import Horario from "../models/horario.model.js"
import Salao from "../models/salao.model.js"

// Criar agendamento
export const createAgendamento = async (req, res) => {
  try {
    const salaoId = req.params.salaoId // Pega o ID do salão
    const { servicoId, dataAgendamento, horarioAgendamento} = req.body // Pega os dados do corpo da requisição
    const clienteId = req.usuario.id // Pega o ID do cliente logado

    // Verifica se o serviço existe
    const salao = await Salao.findById(salaoId)
    if (!salao) {
      return res.status(400).json({ mensagem: "Salão não encontrado" })
    }

    // Verifica se o serviço pertence ao salão
    const servico = await Servico.findById(servicoId)
    if(!servico || servico.salao.toString() !== salaoId) {
      return res.status(400).json({ mensagem: "Serviço não pertence a este salão" })
    }

    // Verifica se o horário está cadastrado para esse dia
    const diaSemana = new Date(dataAgendamento).getDay() // Pega o dia da semana da data do agendamento
    const horarioSalao = await Horario.findOne({
      salao: salaoId,
      dias: diaSemana
    })
    if(!horarioSalao) {
      return res.status(400).json({ mensagem: "Salão não abre nesse dia" })
    }

    // Verifica se o horário escolhido está disponível
    const horarioEscolhido = horarioSalao.horarios.find(horar => horar.hora === horarioAgendamento && horar.disponivel === true)
    if(!horarioEscolhido) {
      return res.status(400).json({ message: "Horário não disponível" });
    }
    
    // Verifica se o horário já está agendado
    const jaAgendado = await Agendamento.findOne({
      salao: salaoId,
      data: dataAgendamento,
      horario: horarioAgendamento,
    })

    if(jaAgendado) {
      return res.status(400).json({ mensagem: "Este horário já está ocupado" })
    }
    
    // Cria o agendamento
    const novoAgendamento = new Agendamento({
      cliente: clienteId,
      salao: salaoId,
      servico: servicoId,
      data: dataAgendamento,
      horario: horarioAgendamento
    })

    // Atualiza o horário como indisponível (campo disponivel = false)
    const horarioIndex = horarioSalao.horarios.findIndex((horar) => horar.hora === horarioAgendamento)
    if(horarioIndex !== -1) {
      horarioSalao.horarios[horarioIndex].disponivel = false
      await horarioSalao.save() // Salva as alterações no banco
    }

    await novoAgendamento.save() // Salva o agendamento no banco

    // Popula o agendamento com os dados do salão
    const agendamentoPopulado = await Agendamento.findById(novoAgendamento._id)
    .populate("salao", "nome endereco") // Traz o nome, endereco do salao
    .populate("servico", "titulo preco duracao") // Traz o servico, titulo e preco
    .populate("cliente", "nome") // Taz o cliente
    .populate("horario", "hora disponivel") // Traz o horario
    

    return res.status(201).json(agendamentoPopulado) // Retorna o agendamento Populado

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar agendamento", erro: err.message })
  }
}

// Listar agendamentos
export const listarAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find() // Busca todos os agendamentos no banco
    .populate("salao", "nome endereco") // Traz o nome, endereco do salao
    .populate("servico", "titulo preco duracao") // Traz o servico, titulo e preco
    .populate("cliente", "nome") // Taz o cliente
    // .populate("horario", "")                                                          Tenho que mecher nisso
    .sort({ dataCadastro: -1 }) // Ordena pelos mais recentes primeiro

    return res.status(200).json(agendamentos) // Retorna a lista de agendamentos

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao listar agendamentos", erro: err.message })
  }
}


// Listar agendamento por ID
export const listarAgendamentoById = async (req, res) => {
  try {
    
  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao listar agendamento", erro: err.message })
  }
}
