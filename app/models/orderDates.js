const mongoose = require('mongoose');

const orderdatesschema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service'
    },
    allDates: []

}, { timestamps: true });


const orderDates = mongoose.model('orderdates', orderdatesschema);

module.exports = orderDates;