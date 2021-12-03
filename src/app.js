"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = express.Router();

mongoose.connect(config.conectionString);

const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');



const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');



// limita arquivos json para até 5Mb para não ter problemas nas imagens
app.use(bodyParser.json({
  limit: '5Mb'
}));
app.use(bodyParser.urlencoded({extended: false}));

//habilita CORS
app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
  next();
});


app.use('/',indexRoute);
app.use('/products',productRoute);
app.use('/customers',customerRoute);
app.use('/orders',orderRoute);




  module.exports = app;
