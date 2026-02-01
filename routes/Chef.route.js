const { createChef, getAllChef, getById, updateChef, deleteCheftById, deleteAllChef } = require('../controller/Chef.controller');

const router = require('express').Router();


router.post('/createChef', createChef);
router.get('/getAll', getAllChef);
router.get('/get/:id', getById);
router.put('/update/:id', updateChef);
router.delete('/delete/:id', deleteCheftById);
router.delete('/delete', deleteAllChef);



module.exports = router;