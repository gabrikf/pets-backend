const db = require('../db')
const Pets = require('../models/pets')(db)
const jwt = require('jsonwebtoken')
const s3 = require('../utils/s3')
require('dotenv').config()


const remove = async (req, res) => {
  await Pets.remove(req.params.id)
  res.send({
  success: true
})
}

const removeImage = async (req, res) => {
  await Pets.removeImage(req.params.petsId,req.params.id)
  res.send({
  success: true
})
}


  const put = async (req, res) => {
    const { pet_name, pet_age, animal_type, description } = req.body
    await Pets.update(req.params.id, [pet_name, pet_age, animal_type, description])
    res.send({
      success: true
    })
  }

  const create = async (req, res) => { 
    const { pet_name, pet_age, animal_type, description } = req.body
    const secret = process.env.JWT_SECRET
    const header = req.headers.authorization
    const headerParts = header.split(' ')
    const payload = jwt.verify(headerParts[1], secret)
    const user_email = payload.email
    const users_id = payload.id[0].id
    await Pets.create([users_id, user_email, pet_name, pet_age, animal_type, description])
    res.send({
      success: true,
      data : req.body
    })
  }


const getAll = async (req, res) => {
  const pets = await Pets.findAll()
  res.send(pets)
}

  const getById = async (req, res) => {
    const secret = process.env.JWT_SECRET
    const header = req.headers.authorization
    const headerParts = header.split(' ')
    const payload = jwt.verify(headerParts[1], secret)
    const users_id = payload.id[0].id
    console.log(users_id)
    const pets = await Pets.findById(users_id)
    res.send(pets)
  }

const getByEmail = async (req, res) => {
  const secret = process.env.JWT_SECRET
    const header = req.headers.authorization
    const headerParts = header.split(' ')
    const payload = jwt.verify(headerParts[1], secret)
    const user_email = payload.email
    const petsByEmail = await Pets.findByEmail(user_email)
    res.send(petsByEmail)
}


const uploadImage = async (req, res) => {
  const myFile = req.file.originalname
  const secret = process.env.JWT_SECRET
  const header = req.headers.authorization
  const headerParts = header.split(' ')
  const payload = jwt.verify(headerParts[1], secret)
  const user_email = payload.email
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${user_email}-${myFile}`,
    ACL: 'public-read',
    ContentType: req.file.mimetype,
    Body: req.file.buffer
  }
  const url = `https://petsjaragua.s3.amazonaws.com/${user_email}-${myFile}`
  await Pets.addImage(req.params.id, [url])
  s3.upload(params, (error, data) => {
    if(error){
      res.status(500).send(error)
    }
  res.status(200).send(data)
  })
}




module.exports = {
  remove,
  removeImage,
  put,
  create,
  uploadImage,
  getAll,
  getByEmail,
  getById
}