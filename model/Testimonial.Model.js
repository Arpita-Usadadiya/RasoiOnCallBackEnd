const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true},
    content: { type: String, required: true},
    profileimage: { type: String }, //Add this field to store the image URL or path
    updatedAt: { type: Date, default: Date.now}
},
{
    timestamps:true
});



module.exports = mongoose.model('Testimonial', TestimonialSchema);