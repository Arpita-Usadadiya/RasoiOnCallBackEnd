const { UserSignup, UserLogin } = require('../controller/User.controller');


const router = require('express').Router();

//Test API Route
router.get('/', (req, res) => {
    res.send({message: 'Ok, API is working'});
});

// Get total users count
router.get("/count", async (req, res) => {
  try {
    const count = await require("../model/User.model").countDocuments();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching count" });
  }
});


//Signup Route
router.post('/signup', UserSignup);

//Login Route
router.post('/login', UserLogin);


module.exports = router;