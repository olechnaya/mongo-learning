var mongoose = require('mongoose');

//User
var User = mongoose.model('Users', {
  email: {
    type: String,
    required:true,
    trim: true,
    minLength: 1
  },
  password: {
    type: Boolean,
    default: false
  }
});

module.exports = {User};
