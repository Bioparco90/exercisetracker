const { mongoose, Schema } = require('mongoose');

const exerciseSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: new Date(),
  },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = { Exercise };
