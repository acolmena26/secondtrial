const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
// const creds = require('../config/config');

var transport = {
  service: 'Gmail',
  auth: {
    user: process.env.email_for_app,
    pass: process.env.password_for_email
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/contact', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  
  var content = `name: ${name} \n email: ${email} \n message: ${content} `

  var mail = {
    from: name,
    to: email,  //Change to email address that you want to receive messages on
    subject: 'Thank you for contacting us!',
    text: `Thank you for buying!`
    
  }

  let mail2 = {
    from: name,
    to: "sebasgrossmann@gmail.com",
    subject: "A customer bought a Product!",
    text: "Go into the website to ship product"
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      transporter.sendMail(mail2,(err,data)=>{x})
      res.json({
        msg: 'success'
      })
    }
  })
})

module.exports = router;

