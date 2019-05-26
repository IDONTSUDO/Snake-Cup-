const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const TaskSchema = new Schema({
  message: {
    type: String
  },
  user_name:{
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})
module.exports = User = mongoose.model('message', TaskSchema)