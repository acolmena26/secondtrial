const mongoose = require ('mongoose');
const Schema   = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose"); 
const bcrypt = require('bcryptjs');

const userSchema = new Schema({

    username: String,
    password: String,
    reviewsUpvoted: Array,
    reviewsDownvoted: Array,
    role: {
        type: String,
        enum:["User","Admin"],
        default: "User",
    }
})

userSchema.methods = {
    checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password)
  },
    hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10)
    }
  }
  
userSchema.pre('save', function (next) {
    if (!this.password) {
      console.log('models/user.js =======NO PASSWORD PROVIDED=======')
      next()
    } else {
      console.log('models/user.js hashPassword in pre save');
      this.password = this.hashPassword(this.password)
      next()
    }
})

userSchema.plugin(passportLocalMongoose); 
const User = mongoose.model('User', userSchema)

module.exports   = User;
