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

async function query(filterBy) {
   try {
      const criteria = _buildCriteria(filterBy)
      const criteriaSort = _buildCriteriaSort(filterBy)
      const collection = await dbService.getCollection('card')

      var cards = await collection
         .find(criteria)
         .sort(criteriaSort)
         .toArray()
      return cards
   } catch (err) {
      logger.error('cannot find cards', err)
      throw err
   }
}

async function getById(cardId) {
   try {
      const collection = await dbService.getCollection('card')
      const card = collection.findOne({ _id: ObjectId(cardId) })
      return card
   } catch (err) {
      logger.error(`while finding card ${cardId}`, err)
      throw err
   }
}

async function remove(cardId) {
   try {
      const collection = await dbService.getCollection('card')
      await collection.deleteOne({ _id: ObjectId(cardId) })
      return cardId
   } catch (err) {
      logger.error(`cannot remove card ${cardId}`, err)
      throw err
   }
}

async function add(card) {
   try {
      const collection = await dbService.getCollection('card')
      const addedCard = await collection.insertOne(card)
      return addedCard.ops[0]
   } catch (err) {
      logger.error('cannot insert card', err)
      throw err
   }
}

async function update(card) {
   try {
      var id = ObjectId(card._id)
      delete card._id
      const collection = await dbService.getCollection('card')
      await collection.updateOne({ _id: id }, { $set: { ...card } })
      return card
   } catch (err) {
      logger.error(`cannot update card ${cardId}`, err)
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

