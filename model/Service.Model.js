
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({

    servicename: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true,
});


module.exports = mongoose.model('Service', ServiceSchema);
