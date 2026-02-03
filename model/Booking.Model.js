const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    bookingDate: { type: Date, required: true },
    
    status: { 
        type: String, 
        enum: ['booked', 'non-booked'], // Updated status options
        default: 'non-booked' // Default to "non-booked"
    },
    notes: { type: String },
    

},{
    timestamp: true,
})

module.exports=mongoose.model('Booknig', BookingSchema)