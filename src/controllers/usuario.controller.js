import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Criar um novo usuário
export const createUsuario = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, email, senha, telefone, foto, tipo } = req.body;
    
    // Validando dados
    if (!nome || !email || !senha || !tipo) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" });
    }

    // Verificando se já existe um usuário com o mesmo email
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ message: "Já existe um usuário com este email!" });
    }

    // Criptografando a senha antes de salvar no MongoDB
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Criar um novo usuário com os dados informados
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada, // Armazena a senha já criptografada
      telefone,
      foto,
      tipo, // "cliente" ou "profissional"
    });

    // Salvar o novo usuário no MongoDB
    novoUsuario.save();

    // Retornar o usuário criado (sem exibir a senha)
    res.status(201).json({
      _id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      telefone: novoUsuario.telefone,
      foto: novoUsuario.foto,
      tipo: novoUsuario.tipo, // "cliente" ou "profissional"
      status: novoUsuario.status, // "ativo"
      dataCadastro: novoUsuario.dataCadastro,
    });
  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao criar usuario:", err); // Log do erro para debug
    req.status(500).json({ message: err.message });
  }
};


// Login de um usuário
export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validando dados
    if (!email ||!senha) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios!" });
    }

     // Busca o usuário pelo email
    const usuario = await Usuario.findOne({ email })
    if(!usuario) {
      return res.status(404).json({ message: "Parece que você ainda não tem uma conta. Verifique seus dados ou crie uma!" });
    }

    // Compara a senha informada com a senha salva no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if(!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas. Por favor, tente novamente." });
    }

    // Gera um token JWT com as informações do usuário
    const token = jwt.sign(
      {
        id: usuario._id,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET, // Chave secreta do JWT
      {
        expiresIn: "5d", // Token expira em 1 dia
      }
    )

    // Retorna os dados do usuário (exceto a senha) e o token
    res.json({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      foto: usuario.foto,
      tipo: usuario.tipo,
      token,
    })

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro ao fazer login" });
  }
}


// Buscar um usuário pelo ID
