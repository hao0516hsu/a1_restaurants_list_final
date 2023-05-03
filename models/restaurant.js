const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restSchema = new Schema({
  "id": {
    type: Number,
    required: true
  },
  "name": {
    type: String
  },
  "name_en": {
    type: String
  },
  "category": {
    type: String
  },
  "image": {
    type: String
  },
  "location": {
    type: String
  },
  "phone": {
    type: String
  },
  "google_map": {
    type: String
  },
  "rating": {
    type: mongoose.Decimal128
  },
  "description": {
    type: String
  }
})

module.exports = mongoose.model('Restaurant', restSchema)