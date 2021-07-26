const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.post('/',userController.create)

router.post('/login', userController.authUser)

router.get('/usuarios', userController.returnUser)

router.get('/:email', userController.findByEmail)

router.get('/:id', userController.returnById)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)


module.exports = router
