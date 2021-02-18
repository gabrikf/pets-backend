const express = require('express')
const router = express.Router()
const petsController = require('../controllers/petsController')
const { needsAuth } = require('../utils/auth')
const upload = require('../utils/multer')
require('dotenv').config


router.use(needsAuth)

router.post('/', petsController.create)

router.delete('/:id', petsController.remove)

router.put('/:id', petsController.put)

router.get('/:id', petsController.getById)

router.get('/', petsController.getByEmail)

router.post('/:id/upload', upload, petsController.uploadImage)

router.delete('/:petsId/images/:id', petsController.removeImage)


module.exports = router