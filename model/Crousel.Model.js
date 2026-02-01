const mongoose = require('mongoose');

const CrouselSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    image: { type: String }, //Add this field to store the image URL or path
    action: { type: String }
},{
    timestamps:true
});



module.exports = mongoose.model('Crousel', CrouselSchema);