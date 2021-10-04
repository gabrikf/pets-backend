const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { needsAuth, needsAuthSuperUser, needsAuthOng} = require('../utils/auth')


router.post('/',userController.create)

router.post('/login', userController.authUser)

router.get('/usuarios', userController.returnUser)

router.get('/:email', userController.findByEmail)

router.get('/:id', userController.returnById)

router.patch('/:id',needsAuthSuperUser, userController.updateUserRole)

router.delete('/:id', userController.deleteUser)

router.get('/return/ongs', userController.returnOngs)

router.post('/ongs/solicitation',needsAuth , userController.createOngUser)

router.get('/ongs/solicitation',needsAuthSuperUser , userController.returnSolicitations)

router.delete('/ongs/solicitation/:id',needsAuthSuperUser , userController.deleteUserSolicitation)


module.exports = router
