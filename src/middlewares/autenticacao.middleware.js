import jwt from "jsonwebtoken";


// Middleware para verificar o token JWT
export const verificarToken = (req, res, next) => {
  try {
    // Pegando o token do header da requisição
    const token = req.headers.authorization

    // Validando se o token foi fornecido
    if(!token){
      return res.status(401).json({ message: "Acesso negado! Token não fornecido." })
    }

    // Verifica e decodifica o token
    const decodificandoToken = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET)

    
    
    // Adiciona os dados do usuário ao request para que possam ser acessados em outras rotas protegidas
    req.usuario = decodificandoToken

    next(); // Passa para o próximo middleware ou rota


  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado!" });
  }
}
