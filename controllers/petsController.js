const db = require('../db')
const Pets = require('../models/pets')(db)
const jwt = require('jsonwebtoken')
const s3 = require('../utils/s3')
require('dotenv').config()


const remove = async (req, res) => {
    const id = req.params.id
    const url = await Pets.findUrlById(id)
    const key = url[0].url.split('com/')[1]
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

// const removeImage = async (req, res) => {
//   const petsByEmail = await Pets.findByEmail(user_email)
//   const s3Params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${user_email}-${myFile}`
//   }
//   try{
//     await s3.deleteObject(s3Params).promise()
    
//     await Pets.removeImage(req.params.petsId,req.params.id)
//       res.send({
//       success: true
//     })
//     return true
//   }catch(err){
//     return false
//   }

  
// }
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


const uploadImage = async (req, res) => {
  let i = 0
  const myFile = req.file.originalname
  const secret = process.env.JWT_SECRET
  const header = req.headers.authorization
  const headerParts = header.split(' ')
  const payload = jwt.verify(headerParts[1], secret)
  const user_email = payload.email
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${user_email}-${i+1}-${myFile}`,
    ACL: 'public-read',
    ContentType: req.file.mimetype,
    Body: req.file.buffer
  }
  const url = `https://petsjaragua.s3.amazonaws.com/${user_email}-${i++}-${myFile}`
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
  getLikes,
  removeImage,
  put,
  create,
  uploadImage,
  getAll,
  getByEmail,
  updateLike,
  getById,
  getByType
}