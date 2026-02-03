const { createBooking, getBooking, getBookingById, updateBooking, deleteBooking } = require('../controller/Booking.Controller');
const verifyToken  = require('../middleware/Auth.Middleware')
const router = require('express').Router();


router.post('/createBook', verifyToken, createBooking);
router.get('/get', verifyToken, getBooking);
router.get('/get/:id', verifyToken, getBookingById);
router.put('/update/:id', verifyToken, updateBooking);
router.delete('/delete', deleteBooking);


module.exports = router;