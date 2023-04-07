const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:["M","F","Others"],
        trim:true,
        required:true
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    otp:{
       type:String,
    }
},
{timestamps:true}

)


module.exports=mongoose.model("User Model",userSchema)