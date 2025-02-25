// Importando o modelo Salao
import mongoose from "mongoose";
import Salao from "../models/salao.model.js";


// Criar um salão
export const createSalao = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, endereco,} = req.body;

    // Validando dados do request
    if ( !nome ||!endereco ) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    // // Verificando se já existe um salão com esse nome
    const salaoExiste = await Salao.findOne({ nome });
    if(salaoExiste) {
      return res.status(400).json({ error: "Já existe um salão com esse nome!" });
    }

    // Criando um novo salão
    const newSalao = new Salao({
      nome,
      dono: req.usuario.id,
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
    const {nome, endereco, servicos} = req.body // Extrai os dados de atualização do corpo da requisição
    

    // Verificando se o ID é válido
    if ( !id ) {
      return res.status(400).json({ message: "ID do salão inválido ou não fornecido!" })
    }

    // Buscando o salão no banco de dados e verificando se o salão existe
    const salao = await Salao.findById(id)
    if (!salao) {
      return res.status(404).json({ message: "Salão não encontrado!" })
    }

      // Verificando se os dados de atualização são os mesmos que já existem no banco de dados
      if(nome === salao.nome) {
        return res.status(400).json({ message: "Esse nome ja está em uso!" })
      }

    // Atualizando somente os campos informados pelo usuário
    if(nome) salao.nome = nome
    if(endereco) salao.endereco = endereco
    if(servicos) salao.servicos = servicos

    // Salvando as alterações no banco de dados
    await salao.save()

    // Retorna o salão atualizado
    res.status(200).json({
      data: salao
    })

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao atualizar salão:", err)
    return res.status(500).json({ message: "Erro interno do servidor ao atualizar salão." })
  }
}


// Deletar um salão específico
export const deleteSalao = async (req, res) => {
  try {
    const {id} = req.params // Extrai o ID dos parâmetros da requisição

    // Verificando se o ID é válido
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID do salão inválido ou não fornecido!" });
    }

    // Buscando e deletando o salão pelo ID no MongoDB
    const salao = await Salao.findByIdAndDelete(id)

   // Verificando se o salão foi encontrado e deletado
    if (!salao) {
      return res.status(404).json({ message: "Salão não encontrado!" })
    }

    // Retorna uma resposta de sucesso
    res.status(200).json({ message: "Salão deletado com sucesso!" })

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao deletar salão:", err);
    return res.status(500).json({ error: err.message })
  }
}
