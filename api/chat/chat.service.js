const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
   remove,
   query,
   getById,
   add,
   update
}

async function query(userID) {
   // console.log(chatsId);
   try {
      // const criteria = _buildCriteria(filterBy)
      // const criteriaSort = _buildCriteriaSort(filterBy)
      const collection = await dbService.getCollection('chat')

      let chats = await collection
         .find( { users: { $in: [ ObjectId(userID) ]} } )
         .toArray()
      return chats
   } catch (err) {
      logger.error('cannot find chats', err)
      throw err
   }
}

async function getById(chatId) {
   try {
      const collection = await dbService.getCollection('chat')
      const chat = collection.findOne({ _id: ObjectId(chatId) })
      return chat
   } catch (err) {
      logger.error(`while finding chat ${chatId}`, err)
      throw err
   }
}

async function remove(chatId) {
   try {
      const collection = await dbService.getCollection('chat')
      await collection.deleteOne({ _id: ObjectId(chatId) })
      return chatId
   } catch (err) {
      logger.error(`cannot remove chat ${chatId}`, err)
      throw err
   }
}

async function add(chat) {
   try {
      const collection = await dbService.getCollection('chat')
      const addedChat = await collection.insertOne(chat)
      return addedChat.ops[0]
   } catch (err) {
      logger.error('cannot insert chat', err)
      throw err
   }
}

async function update(chat) {
   try {
      const users = chat.users.map(user => ObjectId(user))
      chat.users = users
      let id = ObjectId(chat._id)
      delete chat._id
      const collection = await dbService.getCollection('chat')
      await collection.updateOne({ _id: id }, { $set: { ...chat } })
      return chat
   } catch (err) {
      logger.error(`cannot update chat ${chatId}`, err)
      throw err
   }
}

function _buildCriteria(filterBy) {
   const criteria = {}
   const selectedOption = filterBy.selectedOption
      ? filterBy.selectedOption.map(({ value, ...rest }) => value)
      : []

   if (filterBy.name) {
      criteria.name = { $regex: filterBy.name, $options: 'i' }
   }

   if (filterBy.stock || filterBy.stock === false) {
      criteria.inStock = filterBy.stock
   }

   return criteria
}

function _buildCriteriaSort(filterBy) {
   const criteria = {}

   if (filterBy.sort === 'Higher') {
      criteria.price = -1
   }

   if (filterBy.sort === 'Lower') {
      criteria.price = 1
   }

   if (filterBy.sort === 'Newest') {
      criteria.createdAt = -1
   }

   if (filterBy.sort === 'Oldest') {
      criteria.createdAt = 1
   }

   if (!Object.keys(criteria).length) {
      criteria.createdAt = -1
   }

   return criteria
}

