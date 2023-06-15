const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const user = require('../../models/user')

// Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

// Register Page
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({
      message: '除了姓名，其餘欄位有缺漏！'
    })
  }
  if (password !== confirmPassword) {
    errors.push({
      message: '密碼與確認密碼不一致！'
    })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此信箱已被註冊！' })
        res.render('register', {
          errors, name, email, password, confirmPassword
        })
      } else {
        return User.create({ name, email, password })
          .then(() => res.redirect('/users/login'))
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出！')
  res.redirect('/users/login')
})

module.exports = router