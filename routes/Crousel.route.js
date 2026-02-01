const { createCrousel, getAllCrousel, getCrouselById, updateCrousel, deleteCrouselById, deleteCrousel } = require('../controller/Crousel.controller');

const router = require('express').Router();


router.post('/createCrousel', createCrousel);
router.get('/getAllCrousel', getAllCrousel);
router.get('/get/:id', getCrouselById);
router.put('/update/:id', updateCrousel);
router.delete('/delete/:id', deleteCrouselById);
router.delete('/delete', deleteCrousel);


module.exports = router;