const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')

// login page
router.get('/login', (req, res) => {
  res.render('login')
})

// login check
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })(req, res, next)
})

// register page
router.get('/register', (req, res) => {
  res.render('register')
})

// regist check
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  // add error messages
  let errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有欄位都是必填' })
  }
  if (password !== password2) {
    errors.push({ message: '密碼輸入錯誤' })
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    })
  } else {
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        console.log('User already exits')
        res.render('register', {
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          name,
          email,
          password
        })

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash

            newUser
              .save()
              .then(user => {
                res.redirect('/')
              })
              .catch(err => console.log(err))
          })
        )
      }
    })
  }
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/users/login')
})

module.exports = router