const chatService = require('./chat.service.js')
const logger = require('../../services/logger.service')

module.exports = {
   getChats,
   getChatById,
   addChat,
   updateChat,
   removeChat
}

async function getChats(req, res) {
   try {
      logger.debug('Getting Chats')
      const queryParams = req.query || {}
      const chats = await chatService.query(queryParams.userID || {})
      // res.json(chats)
      res.send(chats)
   } catch (err) {
      logger.error('Failed to get chats', err)
      res.status(500).send({ err: 'Failed to get chats' })
   }
}

async function getChatById(req, res) {
   try {
      const chatId = req.params.chatId
      const chat = await chatService.getById(chatId)
      res.json(chat)
   } catch (err) {
      logger.error('Failed to get chat', err)
      res.status(500).send({ err: 'Failed to get chat' })
   }
}

async function addChat(req, res) {
   try {
      const chat = req.body
      const addedChat = await chatService.add(chat)
      // res.json(addedChat)
      res.send(addedChat)
   } catch (err) {
      logger.error('Failed to add chat', err)
      res.status(500).send({ err: 'Failed to add chat' })
   }
}

async function updateChat(req, res) {
   try {
      const chat = req.body
      const updatedChat = await chatService.update(chat)
      res.json(updatedChat)
   } catch (err) {
      logger.error('Failed to update chat', err)
      res.status(500).send({ err: 'Failed to update chat' })
   }
}

async function removeChat(req, res) {
   try {
      const chatId = req.params.chatId
      const removedId = await chatService.remove(chatId)
      res.send(removedId)
   } catch (err) {
      logger.error('Failed to remove chat', err)
      res.status(500).send({ err: 'Failed to remove chat' })
   }
}
