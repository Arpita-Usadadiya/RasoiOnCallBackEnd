const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    name: { type: String, required: true},
    content: { type: String, required: true},
    galleryimage: { type: String }, //Add this field to store the image URL or path
},{
    timestamps: true,
});

module.exports = mongoose.model('Gallery', GallerySchema);