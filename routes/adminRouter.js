const express = require('express')
const router = express.Router()

const auth = require('../controllers/authController')
const adminController = require('../controllers/adminController')

router.get('/', auth, adminController.adminOnly)

router.get('/free', auth, adminController.loggedOnly)

module.exports = router