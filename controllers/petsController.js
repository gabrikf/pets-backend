const db = require('../db')
const Pets = require('../models/pets')(db)
const jwt = require('jsonwebtoken')
const s3 = require('../utils/s3')
const { response } = require('express')
require('dotenv').config()


const removeWithImage = async (req, res) => {
    const id = req.params.id
    const url = await Pets.findUrlById(id)
    let key = url[0].url.split('com/')[1]
    key = decodeURIComponent(key)
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${key}`
    }
    try{
      if(url){
        await s3.deleteObject(s3Params).promise()
      }
      await Pets.remove(id)
      res.send({
      success: true
      })
      return true
    }catch(err){
      return false
    }
    
    }

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
const deleteLike = async (req, res) => {
  const userId = req.params.id
  const { petId } = req.body
  await Pets.disLike(userId, petId)
  return res.send({
    messege: 'success'
  })
}
const createLike = async(req, res) => {
  const userId = req.params.id
  const { petId } = req.body
  await Pets.like(userId, petId)
  return res.send({
    messege: 'success'
  })
}
  const updateLike = async (req, res) => {
    const id = req.params.id
    const likes = req.body
    await Pets.updateLike(id, likes)
    return res.send({
      data: likes
    })
  }

const getLikes = async(req, res) => {
  const likes = await Pets.findLikesByPetId(req.params.id_pet) 
  res.send(likes)
}
const getAll = async (req, res) => {
  const current = req.params.id
  const pets = await Pets.findAllPaginated({currentPage: current})
  res.send(pets)
}

const getByType = async (req, res) => {
  const current = req.params.id
  const type = req.params.type
  const pets = await Pets.findAllPaginatedByType({currentPage: current}, type)
  res.send(pets)
}

  const getById = async (req, res) => {
    const secret = process.env.JWT_SECRET
    const header = req.headers.authorization
    const headerParts = header.split(' ')
    const payload = jwt.verify(headerParts[1], secret)
    const users_id = payload.id[0].id
    
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
const getByOngId = async (req, res) => {
    const ongid = req.params.id
    const current = req.params.id
    const type = req.params.type
    const pets = await Pets.findByOngIdPaginated({currentPage: current}, type, ongid)
    res.send(pets)
}


const uploadImage = async (req, res) => {
  const myFile = req.file.originalname
  const secret = process.env.JWT_SECRET
  const header = req.headers.authorization
  const headerParts = header.split(' ')
  const payload = jwt.verify(headerParts[1], secret)
  const user_email = payload.email
  const date = new Date
  const stringDate = String(date).split(' ').join('_')
  console.log(stringDate)
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${user_email}-${myFile}-${stringDate}`,
    ACL: 'public-read',
    ContentType: req.file.mimetype,
    Body: req.file.buffer
  }
  const url = `https://petsjaragua.s3.amazonaws.com/${encodeURIComponent(params.Key)}`
  await Pets.addImage(req.params.id, [url])
  s3.upload(params, (error, data) => {
    if(error){
      res.status(500).send(error)
    }
  res.status(200).send(data)
  })
}

const authorized = async(req, res) => {
  res.send({
    messege: 'authorizated'
  })
}



module.exports = {
  remove,
  authorized,
  removeWithImage,
  getLikes,
  removeImage,
  put,
  create,
  uploadImage,
  getAll,
  getByEmail,
  updateLike,
  getById,
  deleteLike,
  getByOngId,
  createLike,
  getByType
}
