const { createGallery, getAllGallery, deleteGallery } = require('../controller/Gallery.controller');

const router = require('express').Router();


router.post('/createGallery', createGallery);
router.get('/getAllGallery', getAllGallery);
router.delete('/delete/Gallery', deleteGallery);


module.exports = router;