  import mongoose from 'mongoose'
import Salao from '../models/salao.model.js'
  import Servico from '../models/servico.model.js'


  // Criar um novo serviço 
  export const createServico = async (req, res) => {
    try {
      const { salaoId } = req.params // Pegando o ID do salão da URL
      const {titulo, preco, duracao} = req.body // Pegando os dados do serviço

      // Verifica se existe campos vazios
      if (!titulo || !preco || !duracao) {
        return res.status(400).json({ message: "Preencha todos os campos" });
      }

      // Verifica se o salão existe
      const salao = await Salao.findById(salaoId)
      if(!salao) {
        return res.status(404).json({ message: "Salão não encontrado!" });
      }

      // Verifica se já existe um serviço com esse título no salão
      const servicoExistente = await Servico.findOne({
        titulo,
        salao: salaoId,
      })
      if (servicoExistente) {
        return res.status(400).json({ message: "Já existe um serviço com esse título no salão!" });
      }

      // Cria o serviço
      const novoServico = new Servico({
        titulo,
        preco,
        duracao,
        salao: salao._id, // Associando o salão ao serviço
      }).populate('salao', 'nome endereco')

      await novoServico.save() // Salva no banco de dados

      // Retorna o serviço criado
      res.status(201).json({
        id: novoServico._id,
        titulo: novoServico.titulo,
        preco: novoServico.preco,
        duracao: novoServico.duracao,
        salao: novoServico.salao
      })
      


    } catch (err) {
      return res.status(500).json({ mensagem: "Erro ao criar serviço", err });
    }
  }

  // Listar todos os serviços
  export const getServicos = async (req, res) => {
    try {
      // Busca todos os serviços no banco
      const servicos = await Servico.find().populate('salao', 'nome endereco').sort({dataCadastro: 1 })

      res.status(200).json(servicos); // Retorna os dados

    } catch (err) {
      // Trata erros inesperados
      console.error("Erro ao listar Servicos:", err); // Log do erro para debug
      return res.status(500).json({ error: err.message });
    }
  }

  // Buscar um serviço específico
  export const getServicoById = async (req, res) => {
    try {
      const { salaoId, id } = req.params // Pega o ID do serviço da URL

      // Verifica se o ID é válido
      if (!salaoId || !id) {
        return res.status(400).json({ message: "ID inválido" });
      }

      // Busca o serviço no banco
      const servico = await Servico.findOne({
        _id: new mongoose.Types.ObjectId(id), // Converte o ID para um tipo válido
        salao: new mongoose.Types.ObjectId(salaoId), // Converte o ID do salão para um tipo válido
      }).populate('salao', 'nome endereco')

      // Verifica se o serviço foi encontrado
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }

      // Retorna o serviço encontrado
      res.status(200).json(servico);

    } catch (err) {
      console.log("Erro ao buscar serviço:", err);
      res.status(500).json({ error: err.message });
    }
  }

  // Atualizar um serviço
  export const updateServico = async (req, res) => {
    try {
      const { salaoId, id } = req.params // Pega o ID do serviço da URL
      const { titulo, preco, duracao } = req.body // Pega os dados do serviço

      // Verifica se existe capos vazios
      if (!titulo || !preco || !duracao) {
        return res.status(400).json({ message: "Preencha todos os campos" });
      }

      // Verifica se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(salaoId) || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "IDs inválidos" });
      }

      const updateCampos = {} // Cria um objeto vazio para armazenar os campos a serem atualizados

      // Atualiza os campos se fornecidos
      if (req.body.titulo) updateCampos.titulo = req.body.titulo
      if (req.body.preco) updateCampos.preco = req.body.preco
      if (req.body.duracao) updateCampos.duracao = req.body.body  
  
      // Verifica se o updateCampos está vazio
      if (Object.keys(updateCampos).length === 0) {
        return res.status(400).json({ message: "Nenhum campo para atualizar" });
      }

      // Atualizar o serviço utilizando findByIdAndUpdate
      const servicoAtualizado = await Servico.findByIdAndUpdate(
        id, // ID do serviço
        updateCampos, // Campos a serem atualizados
        { new: true, runValidators: true } // Retorna o novo serviço e aplica validações
      )

      // Verifica se o serviço foi atualizado
      if (!servicoAtualizado) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      } 

      // Retorna o serviço atualizado
      res.status(200).json(servicoAtualizado);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Deletar um serviço
  export const deleteServico = async (req, res) => {
    try {
      const { salaoId, id } = req.params // Pega o ID do serviço da URL

      // Verifica se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(salaoId) || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "IDs inválidos" });
      }

      // Deletar o serviço se ele pertencer ao salão
      const servicoDeletado = await Servico.findOneAndDelete({
        _id: id, // ID do serviço
        salao: salaoId, // Deletar o serviço se ele pertencer ao salão
      })

      // Verifica se o serviço foi deletado
      if (!servicoDeletado) {
        return res.status(404).json({ message: "Serviço não encontrado ou não pertence a este salão" });
      }

      // Retorna uma mensagem de sucesso
      res.status(200).json({ message: "Serviço deletado com sucesso" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
