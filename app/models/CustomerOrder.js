const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service'
    },
    customerName: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    noOfPersons: {
        type: String,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        default: 'pending'
    },
    packageName: {
        type: String
    },
    itemSelected: [],
    charges: []
});

const CustomerOrder = mongoose.model('customerorder', OrderSchema);

module.exports = CustomerOrder;
