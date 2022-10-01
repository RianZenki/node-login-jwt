const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { loginValidate, registerValidate } =require('../controllers/validate')

const userController = {
  register: async function (req, res) {

    const {error} = registerValidate(req.body)
    if(error) return res.status(400).send(error.message)

    const selectedUser = await User.findOne({ email: req.body.email })

    if (selectedUser) return res.status(400).send("Email já cadastrado")

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    })

    try {
      const savedUser = await user.save()
      return res.send(savedUser)
    }
    catch (error) {
      return res.status(400).send(error)
    }
  },

  login: async function (req, res) {

    const {error} = loginValidate(req.body)
    if(error) return res.status(400).send(error.message)

    const selectedUser = await User.findOne({ email: req.body.email })
    if (!selectedUser) return res.status(400).send("Email ou senha incorretos")

    const passwordAndUserMatch = bcrypt.compareSync(req.body.password, selectedUser.password)
    if (!passwordAndUserMatch) return res.status(400).send("Email ou senha incorretos")

    const user = {
      id: selectedUser._id,
      email: selectedUser.email,
      admin: selectedUser.admin
    }

    const token = jwt.sign(user, process.env.TOKEN_SECRET)

    res.header('authorization-token', token)

    return res.send("Usuário logado")
  },
}

module.exports = userController