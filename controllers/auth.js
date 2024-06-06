const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecretKey = "MY_JWT_SECRET_KAY1234";

const UserModel = require("../models/auth");

const signup = async (req, res) => {
    // console.log(req.body);
    //    Validate request body
    const salt = bcrypt.genSaltSync(10);
    console.log(salt);

    const passwordHash = bcrypt.hashSync("12345", salt);
    console.log(passwordHash);

    const newUser = new UserModel({ ...req.body, role: "USER", password: passwordHash });
    const newlyInsertedUser = await newUser.save();
    console.log(newlyInsertedUser._id);
    res.json({
        message: "Registration successful, please sign in",
    });
};
const login = async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    // console.log(user);
    if(!user){
        return res.json({
            message: "User not found, please register first",
        });
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    //   console.log(isPasswordValid);

    const tokenExpiry = ( new Date().getTime() / 1_000 ) + 3600 // 1hr validity
    const payload = {
        userId: user._id,
        name: user.name,
        exp: tokenExpiry,
      };

      const token = jwt.sign(payload, jwtSecretKey);

    if(!isPasswordValid){
        // generate jwt
        return res.json({
            token,
         });
     }

    res.json({
        message: "Incorrect username or password"
    })
};

const authController = {
    signup,
    login,
};

module.exports = authController;