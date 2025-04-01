export const verificaDonoRecurso = (model) => {
  return async (req, res, next) => {
    try {
      // Obtém o ID do recurso da requisição (exemplo: ID do salão ou do usuário)
      const recursoId = req.params.salaoId || req.params.id;

      if (!recursoId) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }

      // Busca o recurso no banco de dados usando o ID
      const recursoBanco = await model.findById(recursoId);

      if (!recursoBanco) {
        return res.status(404).json({ message: "Recurso não encontrado" });
      }

      // Descobre automaticamente o campo que representa o dono do recurso
      const campoDono = recursoBanco.dono ? "dono" : recursoBanco.usuario ? "usuario" : null;

      // Se não encontrar um campo de dono, retorna erro
      if (!campoDono) {
        return res.status(400).json({ message: "Não foi possível determinar o dono do recurso." });
      }

      // Verifica se o usuário autenticado é o dono do recurso
      if (!recursoBanco[campoDono] || recursoBanco[campoDono].toString() !== req.usuario.id.toString()) {
        return res.status(403).json({ message: "Acesso negado! Você não tem permissão para esta ação." });
      }

      next(); // Permite a continuação da requisição

    } catch (err) {
      console.error("Erro ao verificar o dono do recurso:", err);
      res.status(500).json({ message: "Erro no servidor" });
    }
  };
};
