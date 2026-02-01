const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    category: { 
        type: [String],
        enum: ['Trending', 'Partner', 'Food Recipe', 'Must Read'],
        required: true
    },
    image: { type: String }, //Add this field to store the image URL or path
    
},
{
    timestamps: true, // ✅ creates createdAt & updatedAt automatically
  });



module.exports = mongoose.model('Blog', blogSchema);