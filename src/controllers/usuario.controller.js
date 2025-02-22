import Usuario from "../models/usuario.model.js";

export const createUsuario = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, email, senha, telefone, foto, tipo } = req.body;

    // Validando dados
    if(nome || email || senha || telefone || foto || tipo) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
    }

    

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao criar usuario:", err); // Log do erro para debug
    req.status(500).json({ message: err.message });
  }
}
