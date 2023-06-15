const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 設定新增功能的路由 (NOTE: 新增頁要在SHOW之前)
router.get('/new', (req, res) => {
  return res.render('new')
})

// 設定送出新增的路由
router.post('/', (req, res) => {
  const restaurant = req.body
  const userId = req.user._id

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
    description: restaurant.description,
    userId
  })
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// 設定說明頁的路由
router.get('/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id

  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 設定編輯頁的路由
router.get('/:restaurant_id/edit', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id

  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 設定送出編輯的路由
router.put('/:restaurant_id/', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id
  const { restaurant_id, name, name_en, category, image, location, phone, google_map, rating, description } = req.body

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.id = restaurant_id
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// 設定刪除的路由
router.delete('/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router