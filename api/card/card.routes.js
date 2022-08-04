const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getCards, getCardById, addCard, updateCard, removeCard } = require('./card.controller')
const router = express.Router()

router.get('/', log, getCards)
router.get('/:cardId', getCardById)
router.post('/', /*requireAuth, requireAdmin,*/ addCard)
router.put('/:cardId', /*requireAuth, requireAdmin,*/ updateCard)
router.delete('/:cardId', /*requireAuth, requireAdmin,*/ removeCard)

module.exports = router
