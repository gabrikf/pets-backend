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
const createOngUser= async (req, res) => {
  const { message } = req.body
  const secret = process.env.JWT_SECRET
  const header = req.headers.authorization
  const headerParts = header.split(' ')
  const payload = jwt.verify(headerParts[1], secret)
  const ongId = payload.id
  const user = await User.createSolicitation(ongId, message)
  res.send({
    success: true,
    data : user
  })

}
const returnOngs = async (req, res) => {
  const user = await User.findOngs()
  res.send(user)
}
const returnUser = async (req, res) => {
  const user = await User.findAll()
  res.send(user)
}
const returnSolicitations = async (req, res) => {
  const user = await User.findSolicitations()
  res.send(user)
}
const returnSolicitationsById = async (req, res) => {
  const secret = process.env.JWT_SECRET
  const header = req.headers.authorization
  const headerParts = header.split(' ')
  const payload = jwt.verify(headerParts[1], secret)
  const ongId = payload.id
  const user = await User.findSolicitationsById(ongId)
  res.send(user)
}


const returnUserEmail = async (req, res) => {
  const user = await User.findByEmail(req.params.email)
  res.send(user)
}

const returnById = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.send(user)
}

const updateUserRole = async (req, res) => {
  const { role } = req.body
  await User.updateRole(req.params.id, [role])
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
const deleteUserSolicitation = async (req, res) => {
const ongId = req.params.id
  await User.removeuserSolicitation(ongId)
  return res.send({
    messege: 'success'
  })
}

const secret = process.env.JWT_SECRET
const authUser = async (req, res) => {
  const { email, passwd } = req.body
    
  const credentials = await User.findPassByEmailId(email)
  const id = credentials[0].id
  const role = credentials[0].role
  const userPass = await User.findPassByEmail(email)
  const array = []
  for(const object of userPass){
    array.push(object.passwd)
  }
  const pass = array[0]
  try {
    if((bcrypt.compareSync(passwd, pass))){
      const token = jwt.sign({
        id,
        role,
        email
      }, secret, { expiresIn: '2 days'})
      return res.send({
        success: true,
        token,
        id,
        role,
      })
      
    }
    throw new error
  } catch(e) {
    return res.status(404).send({
      error:  {messege: 'wrong credentials.'},
      success: false,
     
    })
  }
  }


module.exports = {

  create: createUser,
  findByEmail: returnUserEmail,
  returnUser: returnUser,
  returnById: returnById,
  updateUserRole,
  deleteUserSolicitation,
  returnSolicitations,
  returnSolicitationsById,
  deleteUser: deleteUser,
  authUser: authUser,
  createOngUser,
  returnOngs
}
