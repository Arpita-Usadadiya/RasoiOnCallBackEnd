const { createTestimonial, getAllTestimonial, getTestimonialByID, updateTestimonial, deleteTestomonial } = require('../controller/Testimonial.controller');

const router = require('express').Router();


router.post('/createTestimonial', createTestimonial);
router.get('/getAll', getAllTestimonial);
router.get('/get/:id', getTestimonialByID);
router.put('/update/:id', updateTestimonial);
router.put('/delete/:id', deleteTestomonial);


module.exports = router;