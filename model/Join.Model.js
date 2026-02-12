const mongoose = require('mongoose');

const JoinSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true,
});



module.exports = mongoose.model('Join', JoinSchema);