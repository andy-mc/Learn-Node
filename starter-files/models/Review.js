const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author !!'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'You must supply an store !!'
  },
  text: {
    type: String,
    required: 'Your review must have text !!'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

function populate(next) {
  this.populate('author');
  next();
}

reviewSchema.pre('find', populate);
reviewSchema.pre('findOne', populate);

module.exports = mongoose.model('Review', reviewSchema);
