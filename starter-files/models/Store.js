const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Please enter a store name !!'
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    tags: [String],
    created: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [
        {
          type: Number,
          required: 'You must supply coordinates !!'
        }
      ],
      address: {
        type: String,
        required: 'You must supply and address !!'
      }
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'You must supply an author'
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Define our indexes
storeSchema.index({
  name: 'text',
  description: 'text'
});

storeSchema.index({
  location: '2dsphere'
});

storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slug(this.name);
  // find other stores that find a slug like andy, andy-1, andy-2
  const slugRegExp = new RegExp(`^(${this.name})((-[0-9]+)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({
    slug: slugRegExp
  });

  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  return next();
  // TODO make slug more resilient so slugs are unique
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'store',
        as: 'reviews'
      }
    },
    { $match: { 'reviews.1': { $exists: true } } },
    {
      $addFields: {
        averageRating: { $avg: '$reviews.rating' }
      }
    },

    { $sort: { averageRating: -1 } },
    { $limit: 10 }
  ]);
};

storeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'store'
});

module.exports = mongoose.model('Store', storeSchema);
