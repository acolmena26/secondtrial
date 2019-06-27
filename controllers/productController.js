const Product = require('../models/Product')

let test = {}

module.exports.getAll = (req,res,next)=>{
  Product.find()
  .populate("influencer")
  .then((p)=>{
    console.log(p)
    res.status(200).json(p)
  })
  .catch()
}

module.exports.getOne = (req, res, next) =>{
  Product.findById(req.params.id)
  .then((product)=>{
      res.json(product)
  })
  .catch((err) =>{
      res.json(err);
  })
}


module.exports.updateTotal = (req, res, next) =>{
  Product.findOneAndUpdate(
    {_id: req.params.id},
    {$inc: {total: - req.body.qty}},
    {new: true}
  )
  .then((product)=>{
    res.status(201).json(product)
  })
  .catch((e) => next(e))
}

module.exports.createProduct = (req,res,next)=>{


  Product.create({
    model: req.body.model,
    description: req.body.description,
    images:req.body.images,
    category: req.body.category,
    prize: req.body.prize,
    influencer: req.body.influencer,
    total: req.body.total
  })
  .then((response)=>{
    test = response._id
    res.status(201).json(response)

  })
  .catch((e)=>next(e))
}

module.exports.addPicture = (req,res,next) =>{
console.log(req.body.picture)

Product.findByIdAndUpdate(test, {images : req.file.url})
.then((product)=>{
  res.status(201).json(product)
})
.catch((e)=>next(e))
}

module.exports.filter = (req, res, next) => {
  const {search} = req.query
  Product.find({
    $or:[
      {model:{$regex:search, $options:'i'}},
      {description:{$regex:search, $options:'i'}},
      {category:{$regex:search, $options:'i'}}
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
}

//Search bar
module.exports.filterCategory = (req, res, next) => {
  const {search} = req.query
  Product.find({
    $or:[
      {category:{$regex:search, $options:'i'}},
      {model:{$regex:search, $options:'i'}},
      {description:{$regex:search, $options:'i'}}

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
}

module.exports.delete = (req, res, next) => {
  const search = req.params.id;

  Product.findOneAndDelete({influencer: search})
      .then(product => {
          res.status(201).json(product)
          })
      .catch(next)
}

module.exports.edit = (req,res, next) => {
  Product.findOneAndUpdate({influencer: req.params.id}, {
    "model": req.body.model,
    "prize": req.body.prize,
    "images": req.body.images,
    "description": req.body.description,
    "category": req.body.category,
    "total": req.body.total
  })
  .then((product)=>{
    res.status(201).json(product)
  })
  .catch((e)=>console.log(e))
}