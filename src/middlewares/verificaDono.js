

export const verificaDono = (model, campoDono = 'dono') => {
  return async (req, res, next) => {
    try {
      // Pega o ID do recurso que queremos modificar.
      const recurso = await model.findById(req.params.id)

      // Verifica se o recurso existe.
      if(!recurso) {
        return res.status(404).json({ message: 'Recurso não encontrado' });
      }

      console.log('ID do recurso:', recurso[campoDono].toString());
      console.log('ID do usuário autenticado:', req.usuario.id.toString());


      // Verifica se o usuário autenticado é o dono do recurso
      if(recurso[campoDono].toString() !== req.usuario.id.toString()) {
        return res.status(403).json({ message: 'Acesso negado! Você não é o dono deste recurso' });
      }

      next()
      
    } catch (err) {
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
}
