const db = require('../db')
const User = require('../models/users')(db)
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const salt = bcrypt.genSaltSync(10)

const createUser = async (req, res) => {
  const { name, passwd, email, whatsapp, city, state, neighborhood } = req.body
  
  const hashPasswd = bcrypt.hashSync(passwd, salt)
  await User.create([ name, hashPasswd, email, whatsapp, city, state, neighborhood ])
  res.send({
    success: true,
    data : req.body
  })
}


const returnUser = async (req, res) => {
  const user = await User.findAll()
  res.send(user)
}

const returnById = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.send(user)
}

const updateUser = async (req, res) => {
  //alterar produtos
  const { name, email, whatsapp, city, state, neighborhood } = req.body
  await User.update(req.params.id, [name, email, whatsapp, city, state, neighborhood])
  res.send({
    success: true,
    data : req.body
  })
}

const deleteUser = async (req, res) => {
  await User.remove(req.params.id)
  res.send({
  success: true
})
}
const secret = process.env.JWT_SECRET
const authUser = async (req, res) => {
  const { email, passwd } = req.body
  const id = await User.findPassByEmailId(email)
  const userPass = await User.findPassByEmail(email)
  const array = []
  for(const object of userPass){
    array.push(object.passwd)
  }
  const pass = array[0]
  if(bcrypt.compareSync(passwd, pass)){
    const token = jwt.sign({
      id,
      email
    }, secret, { expiresIn: '2 days'})
    return res.send({
      success: true,
      token
    })
  }
    res.send({
      success: false,
      messege: 'wrong credentials.'
    })
  }


module.exports = {
  create: createUser,
  returnUser: returnUser,
  returnById: returnById,
  updateUser: updateUser,
  deleteUser: deleteUser,
  authUser: authUser
}
