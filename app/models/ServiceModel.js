const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    serviceName: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    servicesList: {
        type: Object,
        required: true
    },
    coverPicture: {
        type: String,
        required: true
    },
    galleryPictures: [
        {
            type: String,
            required: true
        }
    ],
    basicPackage: [
        {
            type: String,
        }
    ],
    standardPackage: [
        {
            type: String,
        }
    ],
    premiumPackage: [
        {
            type: String,
        }
    ],
    rating: {
        type: Number,
        default: '0'
    },
    hallCharges: {
        type: Number,
        default: 0
    },
    basicPackageCost: {
        type: Number,
        default: 0
    },
    standardPackageCost: {
        type: Number,
        default: 0
    },
    premiumPackageCost: {
        type: Number,
        default: 0
    },
    minimumCost: {
        type: Number,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, { timestamps: true });

const ServiceModel = mongoose.model('service', serviceSchema);

module.exports = ServiceModel;