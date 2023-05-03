// 載入Express
const express = require('express')
const app = express()
const port = 3000
// 載入Express-habdlebars
const exphbs = require('express-handlebars')
// 載入Mongoose
const mongoose = require('mongoose')
// 載入Body-parser
const bodyParser = require('body-parser')
// 載入Method-override
const methodOverride = require('method-override')
// 引入router
const routes = require('./routes/index')
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

// method-override設定
app.use(methodOverride('_method'))

// route設定
app.use(routes)

// 設定啟動伺服器相關
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})