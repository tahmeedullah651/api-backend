const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
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
    starCount: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }

}, { timestamps: true });


const TestimonialModel = mongoose.model('testimonial', TestimonialSchema);

module.exports = TestimonialModel;