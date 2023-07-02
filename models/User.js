const { mongoose, Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
