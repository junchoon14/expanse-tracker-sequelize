const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const User = db.User
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.findAll({
        where: { UserId: req.user.id },
        order: [['date', 'ASC']]
      })
    })
    .then((records) => {
      let totalAmount = 0
      records.forEach(record => {
        totalAmount += Number(record.amount)
      })
      return res.render('index', { records: records, totalAmount: totalAmount })
    })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router