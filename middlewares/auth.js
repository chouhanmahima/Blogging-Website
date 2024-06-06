const jwt = require("jsonwebtoken");

const UserModel = require("../models/auth");

const jwtSecretKey = "MY_JWT_SECRET_KAY1234";

const validateUser = async (req, res, next) => {
    const headers = req.headers;
    const tokenFromHeaders = headers.authorization.split(" ")[1];

  // 1. token should be present
  if (!tokenFromHeaders) {
    return res.status(401).json({
      msg: "Unauthenticated user",
    });
  }

  // 2. secret key validation (this is the same token that we have generated)
  try {
    jwt.verify(tokenFromHeaders, jwtSecretKey);
  } catch (err) {
    return res.status(401).json({
      msg: "Unauthenticated user",
    });
  }
  // 3. token expiry date should not be passed
  const tokenData = jwt.decode(tokenFromHeaders);
  console.log(tokenData);

  const tokenExp = tokenData.exp;
  const now = Math.ceil(new Date().getTime() / 1_000);

  if(tokenExp < now){
    return res.status(401).json({
      msg: "Unauthenticated user",
    });
  }

  // 4. validate the user id if it is present in database
  const userId = tokenData.userId;
  const user = await UserModel.findById(userId);
  if(!user){
    return res.status(401).json({
      msg: "Unauthenticated user",
    });
  }
  req.user = user;
  next();
}

module.exports = validateUser;