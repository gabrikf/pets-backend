const express = require('express')
const router = express.Router()
const users = require('./users')
const pets = require('./pets')
const petsController = require('../controllers/petsController')


router.use('/users', users)

router.use('/pets', pets)

router.get('/', petsController.getAll)


module.exports = router
