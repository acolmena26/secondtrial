const Order = require('../models/Order');
const createError = require('http-errors');


module.exports.createOrder = (req, res, next) => {
  Order.findOneAndUpdate(
    { user: req.user.id, state: 'cart' },
    { $push: { product: [req.body._id] }}, 
    { new: true })
    .then(order => {
      if (order) {
        res.status(201).json(order)
      } else {
        return new Order({
          user: req.user.id,
          product: req.body._id,
        })
        .save()
        .then(order => {
          res.status(201).json(order)
        })
      }
    })
    .catch(next)
}

module.exports.orderMake = (req,res,next)=>{
  if(req.body.user){
    Order.create({
      user:req.body.user,
      email: req.body.email,
      address:req.body.address, 
      cardname: req.body.name,
      userLogged: true,
      product: req.body.products,
      state:"sold"
    })
    .then((order)=>{
      res.json(order)
      })
  .catch((e)=>console.log(e))
  }else{
    Order.create({
      email: req.body.email,
      address:req.body.address, 
      cardname: req.body.name,
      userLogged: false,
      product: req.body.products,
      state:"sold"
    })
    .then((order)=>{
      res.json(order)
      })
  .catch((e)=>console.log(e))
  }
}


module.exports.getCart = (req, res, next) => {

  Order.findOne({ user: req.params.id, state: 'cart' })
    .populate('product')
    .then(order => res.json(order))
    .catch(next)
}

//5ca87284bef68c3a4349f84a

module.exports.paymentCart = (req,res,next) => {
//needs fixin looking up user and cart at same time
  Order.findOneAndUpdate({user:req.user._id , state:"cart"},{
    state: 'sold', 
    address:req.body.address, 
    zip:req.body.address_zip, 
    city:req.body.address_city,
    cardname: req.body.cardname

  })
    .then(order => res.json(order))
    .catch(next)
}

module.exports.deleteProduct = (req, res, next) => {
  const search = req.params.id
  
  Order.findOneAndUpdate(
    { user: req.user.id, state: 'cart' },
    { $pull: { product: search }}, 
    { new: true }
  )
    .populate('product')
    .then(order => {
      res.status(201).json(order)
    })
    .catch(next)
}

module.exports.deleteOrder = (req, res, next) =>{
  const search = req.params.id;
  console.log("user" , search)

  Order.findOneAndDelete({ user: req.user.id, state: 'cart' })
     .then(order => {
      res.status(201).json(order)
    })
    .catch(next)
}