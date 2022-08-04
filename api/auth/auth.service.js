const Cryptr = require('cryptr')

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Eran-1984')

async function login(email, password) {
   logger.debug(`auth.service - login with email: ${email}`)

   const user = await userService.getByEmail(email)
   if (!user) return Promise.reject('Invalid email or password')
   const match = await bcrypt.compare(password, user.password)
   if (!match) return Promise.reject('Invalid email or password')
   
   console.log('Successful login')

   delete user.password
   return user
}

async function signup(email, password, username) {
   const saltRounds = 10

   logger.debug(`auth.service - signup with email: ${email}, username: ${username}`)

   if (!email || !password || !username)
      return Promise.reject('username, email and password are required!')

   const hash = await bcrypt.hash(password, saltRounds)
   return userService.add({ email, password: hash, username })
}

function getLoginToken(user) {
   return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
   try {
      const json = cryptr.decrypt(loginToken)
      const loggedinUser = JSON.parse(json)
      return loggedinUser
   } catch (err) {
      console.log('Invalid login token')
   }
   return null
}

module.exports = {
   signup,
   login,
   getLoginToken,
   validateToken,
}
