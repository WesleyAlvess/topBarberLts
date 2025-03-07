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
    .populate("horario", "hora") // Traz o horario
    .sort({ dataCadastro: -1 }) // Ordena pelos mais recentes primeiro

    // Verifica de existe agendamentos
    if(!agendamentos) {
      return res.status(400).json({ mensagem: "Agendamentos não encontrados" })
    }

    return res.status(200).json(agendamentos) // Retorna a lista de agendamentos

  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao listar agendamentos", erro: err.message })
  }
}


// Listar agendamento por ID
export const listarAgendamentoById = async (req, res) => {
  try {
    const agendamentoId = req.params.id // Pega o ID do agendamento

    const listarUmAgendamento = await Agendamento.findById(agendamentoId)
    .populate("salao", "nome endereco") // Traz o nome, endereco do salao
    .populate("servico", "titulo preco duracao") // Traz o servico, titulo e preco
    .populate("cliente", "nome") // Taz o cliente
    .populate("horario", "hora") // Traz o horario
    if(!listarAgendamentoById) {
      return res.status(400).json({ mensagem: "Agendamento não encontrado" })
    }

    return res.status(200).json(listarUmAgendamento)
    
  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao listar agendamento", erro: err.message })
  }
}

// Atualizar agendamento
export const cancelarAgendamento = async (req, res) => {
  try {
    const { id } = req.params // Pega o ID do agendamento da URL
    const usuarioId = req.usuario.id // Pega o ID do usuário logado

    // Busca agendamento no banco e verifica se ele existe
    const agendamento = await Agendamento.findById(id)
    if(!agendamento) {
      return res.status(400).json({ mensagem: "Agendamento não encontrado" })
    }

    // verifica se o usuario logado e dono do agendamento
    if(agendamento.cliente.toString() !== usuarioId) {
      return res.status(403).json({ mensagem: "Você não tem permissão para cancelar este agendamento" });
    }

    // Verifica se o agendamento já está cancelado
    if(agendamento.status === "cancelado") {
      return res.status(400).json({ mensagem: "Este agendamento já foi cancelado" })
    }

    // Converte a data e horário do agendamento para um objeto Date
    const dataHorarioAgendamento = new Date(`${agendamento.data}T${agendamento.horario}:00`)

    // Obtem o horario atual
    const agora = new Date()

    // Calcula a diferença em milissegundos
    const diferencaMS = dataHorarioAgendamento - agora
    const diferencaHoras = diferencaMS / (1000 * 60 * 60) // Converte para horas

    // Verifica se faltam menos de 2 horas para o agendamento
    if(diferencaHoras < 2) {
      return res.status(400).json({ mensagem: "O cancelamento só pode ser feito até 2 horas antes do horário agendado" });
    } 

    agendamento.status = "cancelado"  // Atualiza o status do agendamento para "cancelado"
    agendamento.cancelado = "true" // Atualiza o valor de cancelado pra true
    await agendamento.save()  // Salva no banco

    return res.status(200).json({ mensagem: "Agendamento cancelado com sucesso" });


  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao cancelar agendamento", erro: err.message })
  }
}
