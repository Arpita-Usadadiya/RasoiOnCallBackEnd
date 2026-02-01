const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
    name: { type: String, required: true},
    address: { type: String, required: true},
    profilepic: { type: String},
    city: { type: String, required: true },
    state: { type: String, required: true },
    area: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    experience: { type: String, required: true },
},
{
    timestamps:true
});


module.exports = mongoose.model('Chef', ChefSchema);