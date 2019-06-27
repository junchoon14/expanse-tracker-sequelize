const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const User = db.User
const { authenticated } = require('../config/auth')

// list all
router.get('/', authenticated, (req, res) => {
  res.send('list all records')
})

// new page
router.get('/new', authenticated, (req, res) => {
  return res.render('new')
})

//  create feature
router.post('/', authenticated, (req, res) => {
  Record.create({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    UserId: req.user.id
  })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(err) })
})

// edit page
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id,
        }
      })
    })
    .then((record) => { return res.render('edit', { record: record }) })
})

// edit feature
router.put('/:id/update', authenticated, (req, res) => {
  Record.findOne({
    where: {
      Id: req.params.id,
      UserId: req.user.id,
    }
  })
    .then((record) => {
      record.name = req.body.name
      record.category = req.body.category
      record.date = req.body.date
      record.amount = req.body.amount

      return record.save()
    })
    .then((record) => { return res.redirect('/') })
    .catch((err) => { return res.status(422).json(err) })
})

// delete feather
router.delete('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      })
    })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })

  // Record.findByPk(req.user.id)
  //  (err, record) => {
  //   if (err) return console.error(err)
  //   record.remove(err => {
  //     if (err) return console.error(err)
  //     return res.redirect('/')
  //   })
  // })
})

// show detail page
// router.get('/:id', authenticated, (req, res) => {
//   User.findByPk(req.user.id)
//     .then((user) => {
//       if (!user) throw new Error("user not found");

//       return Record.findOne({
//         where: {
//           UserId: req.user.id,
//           Id: req.params.id
//         }
//       })
//     })
//     .then((record) => { return res.render('detail', { record: record }) })
//     .catch((error) => { return res.status(422).json(error) })
// })

module.exports = router