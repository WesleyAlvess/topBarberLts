

export const verificaDonoRecurso = (model) => {
  return async (req, res, next) => {
    try {
      // Pega o ID do recurso que queremos modificar.
      const recursoId = req.params.salaoId || req.params.id

      // Verifica se o recurso existe.
      if(!recursoId) {
        return res.status(404).json({ message: 'Recurso não encontrado' });
      }

      console.log(recursoId); // debug.log
      
      // Pega o recurso correto no banco de dados
      const recursoBanco = await model.findById(recursoId)

      console.log(recursoBanco);

      // Verifica se o recurso existe
      if(!recursoBanco) {
        return res.status(404).json({ message: 'Recurso não encontrado' });
      }

      // Detecta dinamicamente se o dono é "usuario" ou "dono"
      const campoDono = recursoBanco.usuario ? "usuario" : "dono"


      // Verifica se o usuário autenticado é o dono do recurso
      if(recursoBanco[campoDono].toString() !== req.usuario.id.toString()) {
        return res.status(403).json({ message: 'Acesso negado! Você não é o dono deste recurso' });
      }

      next()
      
    } catch (err) {
      console.error('Erro ao verificar o dono do recurso:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
}
