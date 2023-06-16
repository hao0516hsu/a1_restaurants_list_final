// 模組引入
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

// 測試資料
const RESTAURANTS_LIST = require('../../restaurant.json').results
const SEED_USERS = [{
  email: 'user1@example.com',
  password: '12345678'
}, {
  email: 'user2@example.com',
  password: '12345678'
}]

// Seeder設定
db.once('open', () => {
  // 存取最終版餐廳清單的陣列
  const NEW_RESTAURANTS_LIST = []
  // 1. 建立User測試資料
  Promise.all(
    SEED_USERS.map((user, index) => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => {
          return User.create({
            email: user.email,
            password: hash
          })
        })
        .then(hashedUser => {
          const userId = hashedUser._id

          // 將RESTAURANTS_LIST指定的餐廳分配給測試USER後，匯入新的陣列
          RESTAURANTS_LIST.forEach((restaurant, idx) => {
            if (restaurant.id >= (3 * index) + 1 && restaurant.id <= (3 * (index + 1))) {
              RESTAURANTS_LIST[idx]["userId"] = userId
              NEW_RESTAURANTS_LIST.push(RESTAURANTS_LIST[idx])
            }
          })
        })
    })
    // 2. 建立Restaurant測試資料
  ).then(() => {
    return Promise.all(
      NEW_RESTAURANTS_LIST.map(nRest => {
        return Restaurant.create({
          id: nRest.id,
          name: nRest.name,
          name_en: nRest.name_en,
          category: nRest.category,
          image: nRest.image,
          location: nRest.location,
          phone: nRest.phone,
          google_map: nRest.google_map,
          rating: nRest.rating,
          description: nRest.description,
          userId: nRest.userId
        })
      })
    )
  })
    .then(() => {
      console.log('done')
      process.exit()
    })
})