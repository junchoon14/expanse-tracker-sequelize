const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('./models')
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const logger = require('./myLogger.js')
const hbs = exphbs.create({
  helpers: {
    setSelected: function (value, checkedValue) {
      return value == checkedValue ? 'selected' : ''
    }
  },
  defaultLayout: 'main',
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(logger())

app.use(session({
  secret: 'IamAwesome',
  resave: 'false',
  saveUninitialized: 'false',
}))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use(flash())

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))
app.use('/filter', require('./routes/filter'))
app.use('/auth', require('./routes/auths'))


app.listen(port, () => {
  db.sequelize.sync({ force: true })
  console.log(`App is running on port ${port}!`)
})