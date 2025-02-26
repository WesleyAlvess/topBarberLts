
export const verificaDonoPerfil = (req, res, next) => {
    try {
      const usuarioId = req.params.id; // Pegando o ID passado na URL
      const usuarioAutenticadoId = req.usuario.id; // Pegando o ID do usuário autenticado

      // Debugging para verificar se os IDs são iguais
      console.log("ID do usuário autenticado:", usuarioAutenticadoId);
      console.log("ID do usuário a ser modificado:", usuarioId);

      // Verificando se o ID do usuário autenticado é igual ao ID do usuário a ser modificado
      if(usuarioId !== usuarioAutenticadoId ) {
        return res.status(403).json({ message: "Acesso negado! Você só pode modificar sua própria conta!" });
      }

      next(); // Passa para o próximo middleware ou rota

    } catch (err) {
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
