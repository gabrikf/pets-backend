const express = require('express')
const router = express.Router()
const users = require('./users')
const pets = require('./pets')
const petsController = require('../controllers/petsController')

router.put('/pets/:id', petsController.updateLike)

router.use('/users', users)

router.use('/pets', pets)

router.get('/:id', petsController.getAll)

router.get('/details/:id', petsController.getByPetId)

router.get('/:type/:id', petsController.getByType)

router.get('/ongs/:id/:ongid', petsController.getByOngId)

module.exports = router
