// Importando o modelo Salao
import mongoose from "mongoose";

// Importando o modelo Salao
import Salao from "../models/salao.model.js";

// Importando o modelo Usuario
import Usuario from "../models/usuario.model.js"


// Criar um salão
export const createSalao = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, endereco, } = req.body; // Extrai os dados do corpo da requisição
    const donoId = req.usuario.id; // Pegando ID do usuário autenticado (vem do middleware de autenticação)

    // Validando dados do request
    if (!nome || !endereco) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    // Verificando se o usuario ja tem um salão cadastrado
    const jaTemSalao = await Salao.findOne({ dono: donoId })
    if (jaTemSalao) {
      return res.status(400).json({ error: "Você já possui um salão cadastrado!" });
    }

    // Verificando se já existe um salão com esse nome
    const salaoExiste = await Salao.findOne({ nome });
    if (salaoExiste) {
      return res.status(400).json({ error: "Já existe um salão com esse nome!" });
    }

    // Criando um novo salão
    const newSalao = new Salao({
      nome,
      endereco,
      dono: donoId, // Define o dono como o usuário autenticado
    })

    // Atualizando o tipo de usuario para "profissional"
    await Usuario.findByIdAndUpdate(donoId, { tipo: "profissional" });

    // Salvando o novo salão no MongoDB
    await newSalao.save();

    // Retornando o salão criado
    res.status(201).json(newSalao);


  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao criar salão:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

// Rota para retornar os dados do perfil do salão
export const authSalaoPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Pegando ID do usuário autenticado
    console.log(usuarioId);

    // Buscando o usuário no banco de dados
    const usuario = await Usuario.findById(usuarioId).select('-senha')
    console.log(usuario);

    // Verificando se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    if (usuario.tipo !== 'profissional') {
      return res.status(400).json({ message: "O usuário não é um profissional!" });
    }

    // Caso o usuário seja profissional, vamos buscar os dados do salão associado
    const salao = await Salao.findOne({ dono: usuarioId }).populate('servicos') // Populando os serviços do salão

    // Verificando se o salão foi encontrado
    if (!salao) {
      return res.status(404).json({ message: "Salão não encontrado!" });
    }

    // Retornando os dados do salão
    res.json(salao);

  } catch (error) {
    console.error("Erro ao buscar perfil do salão:", err);
    res.status(500).json({ message: "Erro ao buscar os dados do salão" });
  }
}

// Listar todos os salões
export const getSalao = async (req, res) => {
  try {
    // Busca todos os salões no banco
    const listarSalao = await Salao.find()

    // Retorna a lista de salões
    res.status(200).json(listarSalao)

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
    res.status(200).json(salao);

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
    const { nome, endereco, servicos } = req.body // Extrai os dados de atualização do corpo da requisição

    // Verificando se os campos estão preenchidos
    if (!nome && !endereco && !servicos) {
      return res.status(400).json({ message: "Informe ao menos um campo para atualizar!" })
    }

    // Verificando se o ID é válido
    if (!id) {
      return res.status(400).json({ message: "ID do salão inválido ou não fornecido!" })
    }

    // Buscando o salão no banco de dados e verificando se o salão existe
    const salao = await Salao.findById(id)
    if (!salao) {
      return res.status(404).json({ message: "Salão não encontrado!" })
    }

    // Verificando se os dados de atualização são os mesmos que já existem no banco de dados
    if (nome === salao.nome) {
      return res.status(400).json({ message: "Esse nome ja está em uso!" })
    }

    // Atualizando somente os campos informados pelo usuário
    if (nome) salao.nome = nome
    if (endereco) salao.endereco = endereco
    if (servicos) salao.servicos = servicos

    // Salvando as alterações no banco de dados
    await salao.save()

    // Retorna o salão atualizado
    res.status(200).json(salao)

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao atualizar salão:", err)
    return res.status(500).json({ message: "Erro interno do servidor ao atualizar salão." })
  }
}


// Deletar um salão específico
export const deleteSalao = async (req, res) => {
  try {
    const { id } = req.params // Extrai o ID dos parâmetros da requisição

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

// Buscar Salao pelo seu numero de celular
export const buscarSalaoNumero = async (req, res) => {
  try {
    // Recebendo numero vindo dos parametros da requisição
    const { celular } = req.params
    console.log(celular);

    // Busca o usuário com esse celular
    const usuario = await Usuario.findOne({ telefone: celular })

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado com esse celular.' })
    }

    // Busca o salão cujo dono é esse usuário
    const salao = await Salao.findOne({ dono: usuario._id }).populate('servicos')

    if (!salao) {
      return res.status(404).json({ mensagem: 'Salão não encontrado para esse número de celular.' })
    }

    res.status(200).json(salao)

  } catch (error) {
    // Trata erros inesperados
    console.error("Erro ao buscar salão pelo seu número:", error);
    return res.status(500).json({ error: error.message })
  }
}
