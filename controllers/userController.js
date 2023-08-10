const asyncHandler = require("express-async-handler");
const bcrpyt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req,res) => {

    // take the variable from the api body
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const userAvailable = await User.findOne({email});

    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    }

    //Hash password
    const hashedPassword = await bcrpyt.hash(password, 10);
    console.log("Hash password :", hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`user created ${user}`);
    if(user){
        res.status(201).json({ _id:user.id, email: user.email});
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "Register the user pls man"});
})

//@desc login user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req,res) => {
   const {email,password} = req.body;

   if(!email || !password){
    res.status(400);
    throw new Error("All fields are mandatory!");
   
   }

   const user = await User.findOne({ email });
   //compare password with hashed
   if(user && (await bcrpyt.compare(password, user.password)))
   {
    const accessToken = jwt.sign({
        user: {
            username: user.username,
            email: user.email,
            id: user.id,
        },
    }, process.env.ACCESS_TOKEN_SECRET,  {expiresIn: "15m"});
    
    res.status(200).json({
        accessToken
    })
   }

   else
   {
    res.status(401)
    throw new Error("email or password is not valid");
   }

})

//@desc current user
//@route GET /api/users/current
// need an access token
//@access private

const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user);
})



module.exports = { registerUser, loginUser, currentUser}