
const { createConnect, getallConnect, getConnectById, updateConnect, deleteConnect } = require('../controller/Connect.Controller');

const router = require('express').Router();

router.post('/create', createConnect)
router.get('/getAll', getallConnect);
router.get('/get/:id', getConnectById);
router.put('/update/:id',updateConnect) ;
router.delete('/delete/:id', deleteConnect)
 


module.exports = router;