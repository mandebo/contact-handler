const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// const validateToken = asyncHandler(async(req,res,next) => {
   
//     let token;
//     let authHeader = req.headers.Authorization || req.headers.authorization;
    
//     if(authHeader && authHeader.startsWith("Bearer"))
//     {
//         console.log("i am inside validate token sheesh");
//         token = authHeader.split(" ")[1];
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//             if(err)
//             {
//                 res.status(401);
//                 throw new Error("User is not authorized");
//             }
//             console.log(decoded);
            
//         });

//     }
// });

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        try {
            const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded.user;
            next();
        } catch (err) {
            res.status(401);
            throw new Error("User is not authorized");
        }
    } else {
        res.status(401);
        throw new Error("Authorization header not provided");
    }
});


module.exports = validateToken;