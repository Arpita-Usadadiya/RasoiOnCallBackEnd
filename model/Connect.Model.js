const mongoose = require('mongoose');

const ConnectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
     // Field to store the image URL or path
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true,
});


module.exports = mongoose.model('Connect', ConnectSchema);