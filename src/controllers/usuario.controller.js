import Usuario from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Criar um novo usuário
export const createUsuario = async (req, res) => {
  try {
    // Pegando dados do request
    const { nome, email, senha, telefone, foto } = req.body;

    // Validando dados
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" });
    }

    // Verifica se o email já está cadastrado
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
      foto: foto || "https://robohash.org/wesley?set=set1", // Se não enviar, usa a imagem padrão
      tipo: "cliente", // Sempre começa como cliente
    });

    // Salvar o novo usuário no MongoDB
    await novoUsuario.save();

    // Gera um token JWT com as informações do usuário
    const token = jwt.sign(
      {
        id: novoUsuario._id,
        tipo: novoUsuario.tipo,
      },
      process.env.JWT_SECRET, // Chave secreta do JWT
      {
        expiresIn: "7d", // Token expira em 1 dia
      }
    );

    // Retornar o usuário criado com o token (sem exibir a senha)
    res.status(201).json({
      _id: novoUsuario._id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      telefone: novoUsuario.telefone,
      foto: novoUsuario.foto, // Aqui retornamos a URL da imagem
      tipo: novoUsuario.tipo, // "cliente"
      status: novoUsuario.status, // "ativo"
      dataCadastro: novoUsuario.dataCadastro,
      token,
    })

  } catch (err) {
    // Trata erros inesperados
    console.error("Erro ao criar usuario:", err); // Log do erro para debug
    res.status(500).json({ message: err.message });
  }
};

// Login de um usuário
export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validando dados
    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" });
    }

    // Busca o usuário pelo email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({
        message:
          "Parece que você ainda não tem uma conta. Verifique seus dados ou crie uma!",
      });
    }

    // Compara a senha informada com a senha salva no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        message: "Credenciais inválidas. Por favor, tente novamente.",
      });
    }

    // Gera um token JWT com as informações do usuário
    const token = jwt.sign(
      {
        id: usuario._id,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET, // Chave secreta do JWT
      {
        expiresIn: "7d", // Token expira em 1 dia
      }
    );

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
};

// Autenticar os dados do usuário e do perfil (middleware)
//retornar os dados do perfil do usuário autenticado.
export const authUsuarioPerfil = async (req, res) => {
  try {
    // Pegando o ID do usuário autenticado (armazenado pelo middleware)
    const usuarioId = req.usuario.id; // Pegando apenas o ID

    // Buscando o usuário no banco de dados (removendo a senha da resposta)
    const usuario = await Usuario.findById(usuarioId).select("-senha");

    // Verificando se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Retornando os dados do usuário
    res.json(usuario);

  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    res.status(500).json({ message: "Erro ao buscar o perfil do usuário" });
  }
};

// Atualizar senha do usuário (middleware)
export const updateSenhaPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Pegando apenas o ID do usuário autenticado
    const { senhaAtual, novaSenha } = req.body; // Extrai os dados de atualização do corpo da requisição


    //Verificando se a nova senha e igual a antiga
    if (senhaAtual === novaSenha) {
      return res.status(400).json({ message: "A nova senha não pode ser igual à senha atual!" });
    }

    // Buscando o usuário no banco de dados
    const usuario = await Usuario.findById(usuarioId);

    // Verificando se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Verificar se a senha atual informada está correta
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha atual inválida!" });
    }

    // Criptografando a nova senha
    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(novaSenha, salt);

    // Salvando as alterações no banco de dados
    await usuario.save();

    // Retornando uma mensagem de sucesso
    res.status(200).json({ message: "Senha alterada com sucesso!" });

  } catch (err) {
    console.error("Erro ao atualizar senha:", err);
    res.status(500).json({ message: "Erro ao atualizar a senha" });
  }
};

// Atualizar dados do perfil do usuário (middleware)
export const updateDadosPerfil = async (req, res) => {
  try {
    // Pegando o ID do usuário autenticado (armazenado pelo middleware)
    const usuarioId = req.usuario.id;

    // Pegando os dados do request
    const { nome, telefone, foto } = req.body;

    // Verificando se ao menos um dado foi fornecido
    if (!nome && !telefone && !foto) {
      return res.status(400).json({ message: "Nenhum dado foi fornecido para atualização." });
    }

    // Buscar o usuário no banco de dados
    const usuario = await Usuario.findById(usuarioId)
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Atualizando so dados enviados pelo usuario (se forem fornecidos)
    if (nome) usuario.nome = nome
    if (telefone) usuario.telefone = telefone
    if (foto) usuario.foto = foto

    // Salvando as alterações no banco de dados
    await usuario.save()

    // Retornando os dados atualizados do usuário (sem a senha)
    res.status(200).json({
      _id: usuario._id,
      nome: usuario.nome,
      telefone: usuario.telefone,
      foto: usuario.foto,
    })

  } catch (err) {
    console.error("Erro ao atualizar dados do perfil:", err);
    res.status(500).json({ message: "Erro ao atualizar dados do perfil" });
  }
};


// Excluir conta do usuário (middleware)
export const deleteContaUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // Pegando apenas o ID do usuário autenticado
    const { senha } = req.body; // Extrai a senha do corpo da requisição
    const usuario = await Usuario.findById(usuarioId) // Buscando o usuário no banco de dados

    // Verificando se o campo senha foi enviado
    if (!senha) {
      return res.status(400).json({ message: "Por favor, preencha sua senha para confirmar a exclusão da conta" });
    }

    //verificando se o usuário existe 
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Comparando a senha informada com a senha salva no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    // Verificando se a senha é válida
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Deletando o usuário do banco de dados
    await Usuario.findByIdAndDelete(usuarioId)

    // Retornando uma mensagem de sucesso
    res.status(200).json({ message: "Conta excluída com sucesso!" });

  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir a conta do usuário" });
  }
}
