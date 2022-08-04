
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
   query,
   getById,
   getByEmail,
   remove,
   update,
   add
}

async function query(filterBy = {}) {
   const criteria = _buildCriteria(filterBy)
   try {
      const collection = await dbService.getCollection('user')
      var users = await collection.find(criteria).toArray()
      users = users.map(user => {
         delete user.password
         user.createdAt = ObjectId(user._id).getTimestamp()
         return user
      })
      return users
   } catch (err) {
      logger.error('cannot find users', err)
      throw err
   }
}

async function getById(userId) {
   try {
      const collection = await dbService.getCollection('user')
      const user = await collection.findOne({ '_id': ObjectId(userId) })
      delete user.password
      return user
   } catch (err) {
      logger.error(`while finding user ${userId}`, err)
      throw err
   }
}
async function getByEmail(email) {
   try {
      const collection = await dbService.getCollection('user')
      const user = await collection.findOne({ email })
      return user
   } catch (err) {
      logger.error(`while finding user ${email}`, err)
      throw err
   }
}

async function remove(userId) {
   try {
      const collection = await dbService.getCollection('user')
      await collection.deleteOne({ '_id': ObjectId(userId) })
   } catch (err) {
      logger.error(`cannot remove user ${userId}`, err)
      throw err
   }
}

async function update(user) {
   try {
      const userToSave = {
         _id: ObjectId(user._id),
         email: user.email,
         username: user.username
      }
      const collection = await dbService.getCollection('user')
      console.log('user', user);
      await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
      return userToSave;
   } catch (err) {
      logger.error(`cannot update user ${user._id}`, err)
      throw err
   }
}

async function add(user) {
   try {
      const userToAdd = {
         username: user.username,
         email: user.email,
         password: user.password,
         friends: [],
         msgId: [],
         isAdmin: false,
         isOnline: false,
         imgUrl: '',
      }
      const collection = await dbService.getCollection('user')
      await collection.insertOne(userToAdd)
      return userToAdd
   } catch (err) {
      logger.error('cannot insert user', err)
      throw err
   }
}

function _buildCriteria(filterBy) {
   const criteria = {}
   if (filterBy.txt) {
      const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
      criteria.$or = [
         {
            email: txtCriteria
         },
         {
            username: txtCriteria
         }
      ]
   }
   if (filterBy.minBalance) {
      criteria.balance = { $gte: filterBy.minBalance }
   }
   return criteria
}


