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
    cuisine: {
  type: String,
},

spiceLevel: {
  type: String,
  enum: ["Mild", "Medium", "Spicy"],
},

pricePerDay: {
  type: Number,
},

rating: {
  type: Number,
  default: 4,
},

// ✅ ADD THIS
  hygieneScore: {
    type: Number,
    default: 8,
    min: 0,
    max: 10,
  },

availability: {
  type: Boolean,
  default: true,
},

},
{
    timestamps:true
});


module.exports = mongoose.model('Chef', ChefSchema);