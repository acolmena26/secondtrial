const express = require('express');
const router  = express.Router();
const Influencer = require('../models/Influencer')
const uploadCloud = require("../config/cloudinary");
// const security = require('../middlewears/admin.mid')
const middleweares = require("../middlewears/secure.mid");



let test = {}


//Get all Influencers in Product Page
router.get('/all',(req,res,next)=>{
  Influencer.find()
  .then((influencer)=>{
    res.status(200).json(influencer)
  })
  .catch((e)=>console.log(e))
})


// filter categories
router.get("/filter/category", (req, res, next) => {
  const {search} = req.query
  Influencer.find({
    $or:[
      {expertise:{$regex:search, $options:'i'}}
    ]
  })
  .then((result)=>{
    res.status(200).json(result)
  })
  .catch((e)=>{
    console.log(e)
    res.json(e)
  })
})

router.get("/:id", (req,res,next) => {
  const id = req.params.id;

  Influencer.findOne({_id: id})
    .then(influencer => {
      res.status(201).json(influencer)
    })
    .catch(next)
})

//Create a Infleuncer for each infleuncer
router.post('/create',middleweares.isAdmin, (req,res,next)=>{
  Influencer.create({
    "name" : req.body.name,
    "review" : req.body.review,
    "expertise" : req.body.expertise,
    "percentage" : req.body.percentage,
    "images" : req.body.images,
  })
  .then((user)=>{
    test = user._id
    res.status(201).json(user)
  })
  .catch((e)=>console.log(e))
});

//ADD Reward
router.post('/reward/:id',(req,res,next)=>{

  Influencer.findByIdAndUpdate(req.params.id, {
  "reward":req.body.reward
  })
  .then((user)=>{
    res.status(201).json(user)
  })
  .catch((e)=>console.log(e))
})
//Update a INfluencer for each infleuncer
router.post('/edit/:id',middleweares.isAdmin,(req,res,next)=>{

  Influencer.findByIdAndUpdate(req.params.id, {
    "name":req.body.name,
    "profilePic": req.body.image,
    "review": req.body.review,
    "expertise": req.body.expertise,
    "percentage": req.body.percentage
  })
  .then((user)=>{
    res.status(201).json(user)
  })
  .catch((e)=>console.log(e))
})

//Add pictures 
router.post('/upload/photo',uploadCloud.single('picture'),(req,res,next)=>{
// const id = req.params
Influencer.findByIdAndUpdate(test, {profilePic : req.file.url}, {new:true})
.then((user)=>{
  res.status(201).json(user)
})
.catch((e)=>next(e))
})

//filtro influencer
router.get('/filter',(req,res,next)=>{
  const {search} = req.query 
  Influencer.find({
    $or:[
      {name: {$regex:search, $options:'i'}},
      {expertise:  {$regex:search, $options:'i'}},
      {review:  {$regex:search,$options:'i'}},
    ]
  })
  // .populate("product")
  .then((result)=>{
    // console.log(res)
    res.status(200).json(result)
  })
  .catch((e)=>{
    console.log(e)
    res.json(e)
  })
})


router.post("/delete/:id",middleweares.isAdmin, (req, res, next) =>{
  Influencer.findByIdAndDelete({_id: req.params.id})
    .then((influencer) =>{
      res.status(201).json(influencer)
    })
    .catch((err) => next(err))
})

module.exports = router;
