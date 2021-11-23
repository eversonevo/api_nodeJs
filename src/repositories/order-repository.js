'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');


exports.get = async() =>{
    
    const res = await Order
    .find({},'number status items')
    .populate('customer','name') // traz todos os dados inclusive do customer
    .populate('items.product','title price'); // traz todos os dados inclusive do customer
    return res;
}


exports.create = async(data) => {
    var order = new Order(data);
    await order.save();
}