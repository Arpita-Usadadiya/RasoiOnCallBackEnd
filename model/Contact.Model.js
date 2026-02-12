const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
   name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true,
});


module.exports = mongoose.model('Contact', ContactSchema);