const userModel = require("../models/userModel");
const shortid = require('shortid');
const JWT_SECRET=process.env.JWT_SECRET
const jwt=require("jsonwebtoken")
const exportFunction = {
  createUser: async (req, res) => {
    try {
      let userDetails = req.body;
      if(userDetails.email){
      const emailCheck=await userModel.findOne({email:userDetails.email})
      if(emailCheck){
        return res.status(400).send({status:false,message:"User with the email already exist!"});
      }
    }else{
      const phoneExist = await userModel.findOne({phone:userDetails.phone});
      if(phoneExist){
        return res.status(400).send({status:false,message:"User with the phone already exist!"});
      }
    }
     const userData = await userModel.create(userDetails);
         res.status(200).send({status: true,message: "Account created OTP send!",data: userData});
     // generate otp
     const generatedOtp = shortid.generate().toLowerCase()
     userData.otp = generatedOtp;
     await userData.save();

    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  },
  loginUser:async(req,res)=>{
    try{
    let {email,phone}=req.body
    const generatedOtp = shortid.generate().toLowerCase()
    if(email){
      const emailCheck=await userModel.findOne({email})
      if(!emailCheck){
        return res.status(400).send({status:false,message:"User with the email doesn't exist!"});
      }else{
         res.status(201).send({status: true,message: "OTP sended to your registered email!",data:{userId:emailCheck._id}});
         emailCheck.otp=generatedOtp
         emailCheck.isAccountVerified = true;
         await emailCheck.save();
      }
    }else{
      const phoneExist = await userModel.findOne({phone});
     if(!phoneExist){
        return res.status(400).send({status:false,message:"User with the phone doesn't exist!"});
      }else{
         res.status(201).send({status: true,message: "OTP sended to your registered mobile!",data:{userId:phoneExist._id}});
         phoneExist.otp=generatedOtp
         phoneExist.isAccountVerified = true;
         await phoneExist.save();
      }
    }


  }catch(error){
    return res.status(500).send({ status: false, message: error.message });
  }
  },
  verifyOtp:async(req,res)=>{
    try {
      const { otp, userId } = req.body;
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(400).send({status:false,message:"User doesn't exist!"});
      }
  
      if (user.otp !== otp) {
        return res.status(400).send({ status:false,message: "Otp is not correct!" });
      }
      let generatedToken=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:'1d'});
  
      user.otp = "";
      await user.save();
  
      return res.status(200).send({status: "true",message: "OTP verified successfully!",
        data: {
          userId: user._id,
          token:generatedToken
          
        },
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  }
 
};

module.exports = exportFunction;
