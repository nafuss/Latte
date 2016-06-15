var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Author = new Schema({
  name: String,
  stars: { type: Number, default: 0 },
  avatar: String,
  documents: [
    {
      id: Number,
      title: String,
      content: String,
      thumbnail: String,
      stars: { type: Number, default: 0 },
    }
  ]
})
