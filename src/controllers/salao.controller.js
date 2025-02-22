// Importando o modelo Salao
import Salao from "../models/salao.model.js";


export const createSalao = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, localizacao, telefone, servicos, horario } = req.body;

    // Criando um novo salão
    const newSalao = new Salao({
      nome,
      localizacao,
      telefone,
      servicos,
      horario,
    })

    // Salvando o novo salão no MongoDB
    await newSalao.save();

    // Retornando o salão criado
    res.status(201).json({
      message: "Salão criado com sucesso!",
      salao: newSalao,
    });


  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
