const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
  rating: {
    type: Number
  },
  runtime: {
    type: String
  },
  // movieImage: {
  //   type: Buffer,
  //   required: true
  // },
  // movieImageType: {
  //   type: String,
  //   required: true
  // }
})

filmSchema.plugin(AutoIncrement, { inc_field: 'id' });

// filmSchema.virtual('moviePoster').get(function () {
//   if (this.movieImage != null && this.movieImageType != null) {
//     return `data:${this.movieImageType};charset=utf-8;base64,${this.movieImage.toString('base64')}`;
//   }
// })

module.exports = mongoose.model('Film', filmSchema);