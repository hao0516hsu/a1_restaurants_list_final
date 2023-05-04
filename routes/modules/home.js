const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sortType = [{ _id: 'desc' }, { _id: 'desc' }, { name: 'asc' }, { name: 'desc' }, { category: 'asc' }, { category: 'desc' }, { location: 'asc' }, { location: 'desc' }]

// 設定首頁的路由
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 設定查詢頁的路由
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  // 若空白搜尋，轉成首頁的路由
  if (!keyword.trim()) {
    return res.redirect("/")
  }
  // mongoose查詢: 用or連接兩個查詢條件，i為不分大小寫
  Restaurant.find({
    $or: [
      { name: { $regex: new RegExp(keyword, 'i') } },
      { category: { $regex: new RegExp(keyword, 'i') } }
    ]
  })
    .lean()
    .then(restaurants => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})

// Select Menu的路由
router.post('/', (req, res) => {
  const selectValue = Number(req.body.sortMethod)

  Restaurant.find()
    .lean()
    .sort(sortType[selectValue - 1])
    .then(restaurants => res.render('index', { restaurants, selectValue }))
    // .then(res.redirect('/'))
    .catch(error => console.log(error))
})

// 搜尋頁面使用Select Menu的路由
router.post('/search', (req, res) => {
  const keyword = req.query.keyword
  const selectValue = Number(req.body.sortMethod)

  Restaurant.find({
    $or: [
      { name: { $regex: new RegExp(keyword, 'i') } },
      { category: { $regex: new RegExp(keyword, 'i') } }
    ]
  })
    .lean()
    .sort(sortType[selectValue - 1])
    .then(restaurants => res.render('index', { restaurants, keyword, selectValue }))
    .catch(error => console.log(error))
})
module.exports = router