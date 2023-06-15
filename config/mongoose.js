// 載入Mongoose
const mongoose = require('mongoose')
// dotenv設定
if (process.env.MONGODB_URI !== 'production') {
  require('dotenv').config()
}
// Mongoose連線設定
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
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

module.exports = db