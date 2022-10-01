function adminOnly(req, res) {

  if (!req.user.admin) return res.status(401).send("Acesso negado")

  return res.send('Dados apenas para Admin')
}

function loggedOnly(req, res) {
  return res.send('Dados apenas para usuários logados')
}

module.exports = { adminOnly, loggedOnly }