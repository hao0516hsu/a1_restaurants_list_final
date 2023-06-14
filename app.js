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
// 載入Express-session
const session = require('express-session')
// 引入router
const routes = require('./routes/index')
require('./config/mongoose')
// 引入Handlebars的自定義Helper
require("./public/javascripts/sort-method")
// 引入Passport
const usePassport = require('./config/passport')

// handlebars設定 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// 設定靜態檔案路徑
app.use(express.static('public'))
// bodyParser設定
app.use(bodyParser.urlencoded({ extended: true }))
// method-override設定
app.use(methodOverride('_method'))
// Passport設定
usePassport(app)
// route設定
app.use(routes)
// Session設定
app.use(session({
  secret: 'MySecret',
  resave: false,
  saveUninitialized: true
}))


// 設定啟動伺服器相關
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})