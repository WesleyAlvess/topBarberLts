import Salao from '../models/salao.model.js'
import Servico from '../models/servico.model.js'

export const createServico = async (req, res) => {
  try {
    const { salaoId } = req.params // Pegando o ID do salão da URL
    const {titulo, preco, duracao} = req.body // Pegando os dados do serviço

    console.log(salaoId);
    

    // Verifica se o salão existe
    const salao = await Salao.findById(salaoId)
    if(!salao) {
      return res.status(404).json({ message: "Salão não encontrado!" });
    }

    // Cria o serviço
    const novoServico = new Servico({
      titulo,
      preco,
      duracao,
      salao: salao._id, // Associando o salão ao serviço
    })

    await novoServico.save() // Salva no banco de dados

    // Retorna o serviço criado
    res.status(201).json(novoServico)


  } catch (err) {
    return res.status(500).json({ mensagem: "Erro ao criar serviço", err });
  }
}
