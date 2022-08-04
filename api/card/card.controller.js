const cardService = require('./card.service.js')
const logger = require('../../services/logger.service')

module.exports = {
   getCards,
   getCardById,
   addCard,
   updateCard,
   removeCard
}

async function getCards(req, res) {
   try {
      logger.debug('Getting Cards')
      var queryParams = req.query || {}
      const cards = await cardService.query(JSON.parse(queryParams.filterBy))
      res.json(cards)
   } catch (err) {
      logger.error('Failed to get cards', err)
      res.status(500).send({ err: 'Failed to get cards' })
   }
}

async function getCardById(req, res) {
   try {
      const cardId = req.params.cardId
      const card = await cardService.getById(cardId)
      res.json(card)
   } catch (err) {
      logger.error('Failed to get card', err)
      res.status(500).send({ err: 'Failed to get card' })
   }
}

async function addCard(req, res) {
   try {
      const card = req.body
      const addedCard = await cardService.add(card)
      // res.json(addedCard)
      res.send(addedCard)
   } catch (err) {
      logger.error('Failed to add card', err)
      res.status(500).send({ err: 'Failed to add card' })
   }
}

async function updateCard(req, res) {
   try {
      const card = req.body
      const updatedCard = await cardService.update(card)
      res.json(updatedCard)
   } catch (err) {
      logger.error('Failed to update card', err)
      res.status(500).send({ err: 'Failed to update card' })
   }
}

async function removeCard(req, res) {
   try {
      const cardId = req.params.cardId
      const removedId = await cardService.remove(cardId)
      res.send(removedId)
   } catch (err) {
      logger.error('Failed to remove card', err)
      res.status(500).send({ err: 'Failed to remove card' })
   }
}
