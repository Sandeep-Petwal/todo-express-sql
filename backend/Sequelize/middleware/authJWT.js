const jwt = require('jsonwebtoken');
const JWT_SECRET = "sandeep";

module.exports = authJwt = (req, res, next) => {
    console.log("\nInside the authJwt Middleware \n");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token 
    // 👆 split the header into array of items then selecting the token `Bearer ${token}`,

    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user; // attaching user to req so contorller can access the user
        console.log("Successfully verified by authJwt middleware ✅!");
        next(); 


    });
};
