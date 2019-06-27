const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  title:{
    type: String
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer'
  },
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  review: {
    type: String
  },
  video:{
    type: String
  },
  upvotes:{
    type: Array
  },
  votes:{
    type: Number,
    default: 0
  },
  voicenote:{
    type: String
  }
}, {timestamps: true});


const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

