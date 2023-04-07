const express = require('express');
const router = express.Router();
const userController=require("../controllers/userController")
// const authentication=require("../middleware/authentication")

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)
router.post("/verify", userController.verifyOtp);
// router.get("/logout",authentication.authenticate,userController.logoutUser)


module.exports = router;