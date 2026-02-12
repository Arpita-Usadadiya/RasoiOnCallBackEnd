const { createInvestor, getallInvestor, getInvestorById, updateInvestor, deleteInvestor } = require('../controller/Investor.Controller');

const router = require('express').Router();

router.post('/createInvestor', createInvestor)
router.get('/getinvestor', getallInvestor);
router.get('/get/:id', getInvestorById);
router.put('/update/:id',updateInvestor) ;
router.delete('/delete/:id', deleteInvestor)
 


module.exports = router;