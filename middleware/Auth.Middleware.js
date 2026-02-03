const jwt = require('jsonwebtoken');

//Use JWT secret from .env (fallback for development)
const JWT_SECRET = process.env.JWT_SECRET;

//Middleware verify the token sent by the client
const verifyToken = (req, res, next) => {
    //Expect the token in the Authentication header (e.g., "Bearer <token>")
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res
        .status(401)
        .json({message: 'Access denied, token missing'});
    }

    //If using "Bearer <token>" format, split to get the token value
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //Contains the userId field
        next();
    } catch(error) {
        res.status(400).json({ message: 'Invalid token'});
    }
    console.log("JWT_SECRET (verify):", process.env.JWT_SECRET);
console.log("TOKEN:", token);

};

module.exports = verifyToken ;

