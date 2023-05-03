// 載入Express
const express = require('express')
const app = express()
const port = 3000
// 載入Express-habdlebars
const exphbs = require('express-handlebars')
// 載入Mongoose
const mongoose = require('mongoose')
// 載入JSON檔改成載入種子資料
const Restaurant = require('./models/restaurant')
// 載入Body-parser
const bodyParser = require('body-parser')
// dotenv設定
if (process.env.MONGODB_URI !== 'production') {
  require('dotenv').config()
}
// Mongoose連線設定
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 資料庫連線狀態
const db = mongoose.connection
// error
db.on('error', () => {
  console.log('mongodb error!')
})
// connect
db.once('open', () => {
  console.log('mongodb connect!')
})
// handlebars設定 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定靜態檔案路徑
app.use(express.static('public'))

// bodyParser設定
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁的路由
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 設定查詢頁的路由
app.get('/search', (req, res) => {
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

// 設定新增功能的路由 (NOTE: 新增頁要在SHOW之前)
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 設定送出新增的路由
app.post('/restaurants', (req, res) => {
  const restaurant = req.body
  return Restaurant.create({
    id: restaurant.restaurant_id,
    name: restaurant.name,
    name_en: restaurant.name_en,
    category: restaurant.category,
    image: restaurant.image,
    location: restaurant.location,
    phone: restaurant.phone,
    google_map: restaurant.google_map,
    rating: restaurant.rating,
    description: restaurant.description
  })
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 設定說明頁的路由
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 設定編輯頁的路由
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 設定送出編輯的路由
app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .then(restaurant => {
      restaurant.id = req.body.restaurant_id
      restaurant.name = req.body.name
      restaurant.name_en = req.body.name_en
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.location = req.body.location
      restaurant.phone = req.body.phone
      restaurant.google_map = req.body.google_map
      restaurant.rating = req.body.rating
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.log(error))
})

// 設定刪除的路由
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const restaurant_id = req.params.restaurant_id

  return Restaurant.findById(restaurant_id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 設定啟動伺服器相關
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})