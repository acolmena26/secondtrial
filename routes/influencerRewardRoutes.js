const express = require('express');
const router  = express.Router();
const InfluencerReward = require('../models/InfluencerReward');


//Get all InfluencerRewards in Product Page
router.get('/all',(req,res,next)=>{
  InfluencerReward.find()
  .then((user)=>{
    res.status(200).json(user)
  })
  .catch()
})

//get just one Influencer Reward

router.get('/getOne/:id', (req,res,next) => {
  InfluencerReward.findOne({influencer: req.params.id})
    .then(infuencerReward => res.json(infuencerReward))
    .catch(next)
})

//Create a Product for each infleuncer
router.post('/create',(req,res,next)=>{
  InfluencerReward.create(req.body)
  .then((user)=>{
    res.status(201).json(user)
  })
  .catch((e)=>next(e))
})

// we need to after create an update one when the stripe api is done

router.post('/update/:id/:reward', (req,res,next)=>{
  InfluencerReward.findOneAndUpdate(
    {influencer: req.params.id},
    {$inc: {counter: 1 , reward: req.params.reward}}, 
    {new: true}
  )
  .then((InfluencerReward)=>{
    res.status(201).json(InfluencerReward)
  })
  .catch((e)=>next(e))
})

module.exports = router;
