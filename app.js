require('dotenv').config();

const bodyParser   = require('body-parser');
// const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
// const hbs          = require('hbs');
const LocalStrategy = require('passport-local').Strategy;
const mongoose     = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const logger       = require('morgan');
const path         = require('path');
const session       = require('express-session');
const passport      = require('passport');
const User = require('./models/User');
const MongoStore = require('connect-mongo')(session)
const createError = require('http-errors');
// const MongoStore = require('connect-mongo')(session)
const cors = require('cors');

// require cors as our security package to enable our API to receive requests from our React app

// require('./config/passport-stuff')
// require in the configuration code we put in config/passport-stuff.js




// (err, database) => {
//   if (err) {
//     console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
//     process.exit(1);
//   }
//   db = database;
//   app.set('db', db);
// }


mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(session({
  secret:process.env.SECRET,
  resave: false, 
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));



// app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("body-parser").text());

app.use((req, res, next) => {
  res.locals.session = req.user;
  next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/order', orderRoutes);

const productsRoutes = require('./routes/productsRoutes');
app.use('/product', productsRoutes);

const influencerRoutes = require('./routes/influencerRoutes');
app.use('/influencer', influencerRoutes);

const influencerRewardRoutes = require('./routes/influencerRewardRoutes');
app.use('/influencer/rewards', influencerRewardRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/reviews', reviewRoutes);

const AudioRoutes = require('./routes/AudioRoutes');
app.use('/audio', AudioRoutes);

const stripe = require('./routes/stripeRoutes')
app.use('/payment', stripe)

const Mailer = require('./routes/nodemailer/nodemailer')
app.use('/authorize', Mailer)

const Shipping = require('./routes/shippingRoutes')
app.use('/shipping', Shipping)

// 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (error, req, res, next) {
//   console.error(error);

//   res.status(error.status || 500);

//   const data = {}

//   if (error instanceof mongoose.Error.ValidationError) {
//     res.status(400);
//     for (field of Object.keys(error.errors)) {
//       error.errors[field] = error.errors[field].message
//     }
//     data.errors = error.errors
//   } else if (error instanceof mongoose.Error.CastError) {
//     error = createError(404, 'Resource not found')
//   }

//   data.message = error.message;
//   res.json(data);
// });



module.exports = app;
