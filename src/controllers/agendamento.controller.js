import Agendamento from "../models/agendamento.model.js"
import Servico from "../models/servico.model.js"
import Horario from "../models/horario.model.js"
import Salao from "../models/salao.model.js"

// Criar agendamento
export const createAgendamento = async (req, res) => {
  try {
    const { servicoId, horarioId } = req.body // Pegando os dados do body
    const salaoId = req.params.salaoId; // Pegando o ID do salão pela URL
    const clienteId = req.usuario.id // Pegando o ID do cliente pelo token
    console.log(clienteId, "Esse e o ID do cliente");
    console.log(salaoId, "Esse e o ID do salão");
    
    
    // Verificando se salão existe
    const salao = await Salao.findById(salaoId)
    if(!salao) {
      return res.status(400).json({ message: "Salão não encontrado" })
    }

    //  Verificar se o serviço pertence ao salão
    const servico = await Servico.findById(servicoId)
    console.log(servico, "Esse verifica o serviço");
    
    if(!servico || !servico.salao.equals(salaoId)) {
      return res.status(400).json({ message: "Serviço inválido para este salão" })
    }
    console.log(servico.salao.equals(salaoId));
    
    
    // Verificar se o horário já está ocupado
    const horario = await Horario.findOne({
      salao: salaoId, 
      _id: horarioId
    })
    if(!horario) {
      return res.status(400).json({ message: "Horário já ocupado" })
    }

    // Criar agendamento
    const novoAgendamento = new Agendamento({
      salao: salaoId,
      servico: servicoId,
      horario: horarioId,
      cliente: clienteId,
      status: "pendente"
    })

    await novoAgendamento.save(); // Salva no banco

    return res.status(201).json(novoAgendamento); // Retorna agendamento

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




















// const { salaoId } = req.params; // Pegando o id do salão pela url
// const { servico, data } = req.body; // Pegando os dados do body
// const clienteId = req.usuario.id; // Pegando o id do cliente pelo token

// // Verificando se todos os dados estão preenchidos
// if(!servico || !data) {
//   return res.status(400).json({ mensagem: "Preencha todos os campos!" })
// }

// // Buscar o serviço pelo nome dentro do salão
// const salaoEscolhido = await Servico.findOne({
//   titulo: servico,
//   salao: salaoId
// })

// // Verificar se o serviço existe
// if(!salaoEscolhido) {
//   return res.status(400).json({ mensagem: "Serviço não encontrado nesse salão." })
// }

// // Verificar se o horário está dentro da agenda do salão
// const diaSemana = new Date(data).getDay() // 0 (Dom) até 6 (Sáb)
// const horarioSalao = await Horario.findOne({
//   salao: salaoId,
//   dias: diaSemana
// })

// if(!horarioSalao) {
//   return res.status(400).json({ mensagem: "O salão não abre nesse dia." })
// }

// // Verificar se o horário está dentro do expediente
// const horaAgendada = new Date(data).toISOString().split('T')[1].slice(0, 5) // Formato HH:MM
// if(horaAgendada < horarioSalao.inicio || horaAgendada > horarioSalao.fim) {
//   return res.status(400).json({ message: "Horário fora do expediente do salão." });
// } 

// // Verificar se o horário já está ocupado
// const existeAgendamento = await Agendamento.findOne({
//   salao: salaoId,
//   data
// })
// if(existeAgendamento) {
//   return res.status(400).json({ message: "Esse horário já está agendado." });
// }

// // Criando o novo agendamento
// const novoAgendamento = new Agendamento({
//   cliente: clienteId,
//   salao: salaoId,
//   servico: salaoEscolhido._id,
//   data,
// })

// await novoAgendamento.save();

// return res.status(201).json(novoAgendamento);
