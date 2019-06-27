const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const User = db.User
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  Record.findAll({
    where: { UserId: req.user.id }
  })
    .then((all) => {
      const month = req.query.month
      const cate = req.query.category
      let totalAmount = 0
      let records = all.filter(record => {
        const inMonth = record.date.split("-")[1]
        if (month && cate) {
          return record.category.includes(cate) && inMonth.includes(month)
        } else if (month) {
          return inMonth.includes(month)
        } else if (cate) {
          return record.category.includes(cate)
        } else {
          return record
        }
      })
      records.forEach(record => {
        totalAmount += Number(record.amount)
      })
      return res.render('index', { records: records, totalAmount: totalAmount, month: month, cate: cate })
    })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router

// sequelize.where(sequelize.fn('MONTH', sequelize.col('dateField')), req.query.month),
//   { cate: category }