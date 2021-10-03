const express = require('express')
const router = express.Router()
const petsController = require('../controllers/petsController')
const { needsAuth } = require('../utils/auth')
const upload = require('../utils/multer')
require('dotenv').config


router.use(needsAuth)

router.post('/', petsController.create)

router.delete('/:id', petsController.remove)

router.delete('/image/:id', petsController.removeWithImage)

router.put('/:id', petsController.put)

router.get('/', petsController.getById)

router.get('/likes/return/:page', petsController.getByLike)

router.get('/auth', petsController.authorized)

router.post('/:id/upload', upload, petsController.uploadImage)

router.post('/new/likes/:petId', petsController.createLike)

router.delete('/:petsId/images/:id', petsController.removeImage)

router.delete('/delete/likes/:petId', petsController.deleteLike)



module.exports = router