// 載入Express
const express = require('express')
const app = express()
const port = 3000
// 載入Express-habdlebars
const exphbs = require('express-handlebars')
// 載入Body-parser
const bodyParser = require('body-parser')
// 載入Method-override
const methodOverride = require('method-override')
// 引入router
const routes = require('./routes/index')
require('./config/mongoose')

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