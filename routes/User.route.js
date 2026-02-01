const { UserSignup, UserLogin } = require('../controller/User.controller');


const router = require('express').Router();

//Test API Route
router.get('/', (req, res) => {
    res.send({message: 'Ok, API is working'});
});

//Signup Route
router.post('/signup', UserSignup);

//Login Route
router.post('/login', UserLogin);


module.exports = router;