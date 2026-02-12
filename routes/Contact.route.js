const { createContact, getallContact } = require('../controller/Contact.controller');

const router = require('express').Router();

router.post('/createContact',createContact  );
router.get('/get',  getallContact);

module.exports = router;