const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    image: { type: String },
    updatedAt: { type: Date, default: Date.now }
},{
    timestamps: true,
});


module.exports = mongoose.model('Investor', InvestorSchema);