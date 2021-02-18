const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.post('/create',userController.create)

router.post('/login', userController.authUser)

router.get('/', userController.returnUser)

router.get('/:id', userController.returnById)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)


module.exports = router
