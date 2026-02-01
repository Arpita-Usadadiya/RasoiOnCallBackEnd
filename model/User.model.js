const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String }, //Add this field to store the image URL or path
    phone: { type: String},
    profileImage: { type: String},
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],
},
{
    timestamps: true, // ✅ creates createdAt & updatedAt automatically
  }
);


//not executed In Mongoose v7+, pre('save') does NOT use next the same way
// When using async/await, next becomes undefined
// So calling next() → 💥 next is not a function
// //Middleware to update the updatedAt field before saving
// UserSchema.pre('save', function(next) {
//     this.createdAt = Date.now();
//     next();
// });

module.exports = mongoose.model('User', UserSchema);