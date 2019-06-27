const configureStripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.NODE_ENV === 'production'
    ? process.env.sk_live_MY_SECRET_KEY
    : process.env.sk_test_MY_SECRET_KEY;

    //este esta alreves aproposito
    // ? process.env.sk_test_MY_SECRET_KEY
    // : process.env.sk_live_MY_SECRET_KEY;

const stripe = configureStripe(STRIPE_SECRET_KEY);

module.exports = stripe;
