const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getChats, getChatById, addChat, updateChat, removeChat } = require('./chat.controller')
const router = express.Router()

router.get('/', log, getChats)
router.get('/:chatId', getChatById)
router.post('/', /*requireAuth, requireAdmin,*/ addChat)
router.put('/:chatId', /*requireAuth, requireAdmin,*/ updateChat)
router.delete('/:chatId', /*requireAuth, requireAdmin,*/ removeChat)

module.exports = router
