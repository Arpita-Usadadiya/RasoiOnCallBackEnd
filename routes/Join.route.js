
const { createJoin, getallJoins, getJoinById, updateJoins, deleteJoin } = require('../controller/Join.Controller');


const router = require('express').Router();

router.post('/createJoin',  createJoin)
router.get('/get',   getallJoins)
router.get('/get/:id', getJoinById)
router.put('/update/:id',updateJoins)

router.delete('/delete/:id',deleteJoin)

module.exports = router;