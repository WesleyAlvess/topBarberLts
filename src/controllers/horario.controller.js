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

    // Se não encontrar nenhum horário cadastrado para o salão, retorna erro 404 (não encontrado)
    if (!horarios.length) {
      return res.status(404).json({ message: "Horários não encontrados para esse salão." });
    }

    console.log("Horários encontrados:", JSON.stringify(horarios, null, 2));


    if (!horarios[0].dias || !Array.isArray(horarios[0].dias)) {
      return res.status(400).json({ message: "O campo 'dias' não está definido corretamente." });
    }

    // Array com os nomes dos dias da semana para facilitar leitura no frontend
    const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

    // Formata os dados do banco para enviar apenas as informações úteis ao frontend
    const horariosFormatados = horarios[0].dias.map((diaInfo) => ({
      dia: diaInfo.dia, // Número do dia (0 a 6)
      nomeDia: diasDaSemana[diaInfo.dia],  // Nome do dia baseado no índice (ex: 0 = Domingo)
      fechado: diaInfo.fechado, // Booleano: se o salão está fechado nesse dia
      horarios: diaInfo.horarios.map((h) => h.hora), // Extrai só os horários como strings (ex: "09:00")
    }))

    // Retorna os dados formatados com status 200 (sucesso)
    return res.status(200).json({
      salao: horarios[0].salao.nome,
      dias: horariosFormatados
    });

  } catch (err) {
    // Loga o erro no console do servidor para facilitar a depuração
    console.error("Erro no getHorarios:", err);
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
    const { salaoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(salaoId)) {
      return res.status(400).json({ message: "ID do salão inválido" });
    }

    await Horario.deleteMany({ salao: salaoId });

    return res.status(200).json({ message: "Todos os horários foram apagados com sucesso!" });

  } catch (err) {
    console.error("Erro ao deletar horário:", err);
    return res.status(500).json({ mensagem: "Erro ao deletar horário", erro: err.message });
  }
};


// Função para calcular horários disponíveis para os próximos 7 dias
export const calcularHorariosDisponiveis = async (req, res) => {
  try {
    const { salaoId } = req.params;
    const horarioCadastrado = await Horario.findOne({ salao: salaoId });

    // Obter a data atual
    const hoje = new Date();
    const diasDisponiveis = [];

    // Loop para os próximos 7 dias
    for (let i = 0; i < 7; i++) {
      const diaAtual = new Date(hoje);
      diaAtual.setDate(hoje.getDate() + i); // Avança um dia por vez

      // Obtém o número do dia da semana (0 = domingo, 1 = segunda-feira, ...)
      const diaSemana = diaAtual.getDay();

      // Encontre os horários do dia correspondente (usando o número do dia)
      const horariosDia = horarioCadastrado.dias.find(dia => dia.dia === diaSemana);

      // Se o salão estiver aberto neste dia
      if (horariosDia && !horariosDia.fechado) {
        diasDisponiveis.push({
          dia: diaSemana, // Ex: 0 para domingo, 1 para segunda-feira
          data: diaAtual.toISOString().split('T')[0], // Data no formato yyyy-mm-dd
          horariosDisponiveis: horariosDia.horarios.filter(horario => horario.disponivel),
        });
      }
    }

    return res.status(200).json({
      mensagem: 'Horários disponíveis encontrados com sucesso!',
      diasDisponiveis,
    });
  } catch (err) {
    console.error("Erro ao procurar horários disponíveis:", err);
    return res.status(500).json({ mensagem: "Erro ao procurar horários disponíveis", erro: err.message });
  }
};

