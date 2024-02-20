const express = require('express')
const SecurityController = require('../controllers/SecurityController')

const router = express.Router()
const securityController = new SecurityController()

router.get('/user/register' , securityController.renderRegister)
router.get('/user/login' , securityController.renderLogin)

router.post('/user/login' , securityController.userLogin)
router.post('/user/register' , securityController.createUser)



module.exports = router