/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//  add the pasportlocal--- to the userschema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
