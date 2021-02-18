const jwt = require('jsonwebtoken')
require('dotenv').config()

// middleware
const needsAuth = (req, res, next) => {
    if(req.headers && req.headers.authorization){
    const header = req.headers.authorization
    const headerParts = header.split(' ')
    const secret = process.env.JWT_SECRET
    try{
        const payload = jwt.verify(headerParts[1], secret)
        res.locals.user = payload.user
        return next()
    }catch(err){}
}
    res.send({
        error: true,
        messege: 'needs auth'
    })
}

module.exports = { needsAuth }