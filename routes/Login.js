var express = require("express");
var router = express.Router();
var RegistrationSchema = require("./Model/RegistrationSchema");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let UserList = await RegistrationSchema.find();
    res.json({
      status: "success",
    });
  } catch (e) {
    console.log(e);
  }
});

// Login Authorizaton
router.post("/UserValidation", async function (req, res, next) {
  try {
    const { email, Password } = req.body;

    // email already exist store in a variable
    const UserDetails = await RegistrationSchema.findOne({ email });

    // email not exist send json
    if (!UserDetails) {
      return res.status(404).json({
        status: "email could not find",
      });
    }

    // get the hash password from the db
    const savePwd = UserDetails.hashPassword;

    // compare the hashpassword to password
    const isvalid = await bcrypt.compare(Password, savePwd);
    if (!isvalid) {
      console.log("Provided Password:", Password);
      console.log("Stored Hash Password:", savePwd);
      return res.status(401).json({
        status: "password is invalidd",
      });
      console.log(e, "error");
    }

    // get the current time for check the expiring time
    const CurrentTime = new Date();

    // get the expiring time from the db
    const ExpiringTime = await UserDetails.EndTime;

    if (CurrentTime > ExpiringTime) {
      return res.json({
        status: "your validity time is expiry please upgrade",
      });
    }
    // Secretkey for jwt
    const Secret =
      "ae263be1ad92aa9b6c022f04ce5f2e19526c26029b2a9e16d424a22de39d4214";

    //    for JsonWebToken send
    const token = jwt.sign({ email }, Secret, { expiresIn: "1h" });
    return res.status(200).json({
      status: "success",
      UserDetails,
      token: token,
    });
  } catch (error) {
    console.log("error", error);
    res.json({
      status: "error",
      message: error,
    });
    console.log(e)
  }
});

module.exports = router;
