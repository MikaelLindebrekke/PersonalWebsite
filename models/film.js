const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  released: {
    type: Number
  },
  genre: {
    type: String
  },
  runtime: {
    type: String
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  rtRating: {
    type: Number,
    min: 0,
    max: 100
  },
  mikellyRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  watched: {
    type: Boolean,
    default: false
  },
  comments: {
    type: String,
    default: ' '
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

  // movieImage: {
  //   type: Buffer,
  //   required: true
  // },
  // movieImageType: {
  //   type: String,
  //   required: true
  // }
});

// filmSchema.virtual('moviePoster').get(function () {
//   if (this.movieImage != null && this.movieImageType != null) {
//     return `data:${this.movieImageType};charset=utf-8;base64,${this.movieImage.toString('base64')}`;
//   }
// })

module.exports = mongoose.model('Film', filmSchema);