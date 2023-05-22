const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  displayname: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);