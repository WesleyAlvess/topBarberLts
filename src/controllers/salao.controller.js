// Importando o modelo Salao
import Salao from "../models/salao.model.js";


// Criar um salão
export const createSalao = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, dono, endereco,} = req.body;

    // Validando dados do request
    if ( !nome ||!dono ||!endereco ) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    // Verificando se o dono existe
    const donoExiste = await Salao.findOne({ nome });
    if(donoExiste) {
      return res.status(400).json({ error: "Já existe um salão com esse nome!" });
    }

    // Criando um novo salão
    const newSalao = new Salao({
      nome,
      dono,
      endereco,
    })

    // Salvando o novo salão no MongoDB
    await newSalao.save();

    // Retornando o salão criado
    res.status(201).json({
      data: newSalao,
    });


  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao criar salão:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// Listar todos os salões
export const getSalao = async (req, res) => {
  try {
    const listarSalao = await Salao.find()
    res.status(200).json({
      data: listarSalao,
    })
  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao listar salões:", err); // Log do erro para debug
    return res.status(500).json({ error: err.message });
  }
}

// Listar um salão específico
export const getSalaoById = async (req, res) => {
  try {
    // Pegando o ID do salão
    const { id } = req.params // Extrai o ID dos parâmetros da requisição
    
    // Verificando se o ID é válido
    if (!id) {
      return res.status(400).json({ message: "ID do salão não fornecido!" })
    }
    
    // Buscando o salão pelo ID no MongoDB
    const salao = await Salao.findById(id)

    // Verificando se o salão foi encontrado
    if (!salao) {
      return res.status(404).json({ message: "Salão não encontrado!" })
    }

    // Retorna o salão encontrado
    res.status(200).json({
      data: salao,
    });

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao buscar salão:", err); // Log do erro para debug
    return res.status(500).json({ error: err.message });
  }
}


// Atualizar um salão específico
export const updateSalao = async (req, res) => {
  try {
    const { id } = req.params // Extrai o ID dos parâmetros da requisição
    const atualizaDados = req.body // Extrai os dados de atualização do corpo da requisição

    // Verificando se o ID é válido
    if ( !id ) {
      return res.status(400).json({ message: "ID do salão não fornecido!" })
    }

    // Verificando se os dados de atualização são válidos
    if (Object.keys(atualizaDados).length === 0) {
      return res.status(400).json({ message: "Nenhum dado de atualização fornecido!" })
    }
    // Buscando o salão pelo ID no MongoDB
    const salao = await Salao.findById(id)

    // Verificando se o salão foi encontrado
    if (!salao) {
      res.status(404).json({ message: "Salão não encontrado!" })
    }

    // Atualizando os dados do salão
    Object.keys(atualizaDados).forEach((key) => {
      salao[key] = atualizaDados[key] // Atualiza apenas os campos enviados
    })

    // Salvando as alterações no MongoDB
    await salao.save()

    // Retorna o salão atualizado
    res.status(200).json({
      message: "Salão atualizado com sucesso!",
      data: salao,
    })

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao atualizar salão:", err); // Log do erro para debug
    return res.status(500).json({ error: err.message });
  }
}


// Deletar um salão específico
export const deleteSalao = async (req, res) => {
  try {
    const {id} = req.params // Extrai o ID dos parâmetros da requisição

    // Verificando se o ID é válido
    if (!id) {
      return res.status(400).json({ message: "ID do salão não fornecido!" })
    }

    // Buscando o salão pelo ID no MongoDB
    const salao = await Salao.findById(id)

    // Verificando se o salão foi encontrado
    if (!salao) {
      res.status(404).json({ message: "Salão não encontrado!" })
    }

    // Deletando o salão do MongoDB
    await salao.delete()

    // Retorna uma resposta de sucesso
    res.status(200).json({ message: "Salão deletado com sucesso!" })

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao deletar salão:", err);
    return res.status(500).json({ error: err.message })
  }
}
