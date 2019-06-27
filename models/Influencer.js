const mongoose = require ('mongoose');
const Schema   = mongoose.Schema;

const influencerSchema = new Schema({
  name: {
    type: String
  },
  percentage:{
    type: Number
  },
  reward: {
    type: Number,
    default: 0
  },
  product : {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  
  profilePic: {
    type: String,
  },
  review: String,
  expertise: [{
    type: String,
    enum: ["Athlete","Musician","Tech","Artist"]
  }],
  role: {
    type: String,
    enum:["Influencer","Admin"],
    default: "Influencer",
}
}, {timestamps:true})

module.exports = mongoose.model('Influencer', influencerSchema)


