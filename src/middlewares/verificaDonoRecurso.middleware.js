

export const verificaDonoRecurso = (model, campoDono = 'dono') => {
  return async (req, res, next) => {
    try {
      // Pega o ID do recurso que queremos modificar.
      const recurso = await model.findById(req.params.id)

      // Verifica se o recurso existe.
      if(!recurso) {
        return res.status(404).json({ message: 'Recurso não encontrado' });
      }

      // Verifica se o usuário autenticado é o dono do recurso
      if(recurso[campoDono].toString() !== req.usuario.id.toString()) {
        return res.status(403).json({ message: 'Acesso negado! Você não é o dono deste recurso' });
      }

      next()
      
    } catch (err) {
      console.error('Erro ao verificar o dono do recurso:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
}
