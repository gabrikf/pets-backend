const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.post('/',userController.create)

router.post('/login/sign', userController.authUser)

router.get('/usuarios', userController.returnUser)

router.get('/:email', userController.findByEmail)

router.get('/:id', userController.returnById)

router.patch('/:id', userController.updateUserRole)

router.delete('/:id', userController.deleteUser)

router.get('/return/ongs', userController.returnOngs)

module.exports = router
