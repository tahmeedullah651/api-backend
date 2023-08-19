const mongoose = require('mongoose');

const RefreshSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });


const RefreshModel = mongoose.model('refreshtoken', RefreshSchema);

module.exports = RefreshModel;