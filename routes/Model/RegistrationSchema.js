const mongoose = require('mongoose');


const RegistrationSchema=new mongoose.Schema({
   name:{
        type:String,
    },
    email:{
        type:String,
        required: true
       
    },
    Password:{
        type: String,
        required: true,
        minlength: 8,
    },
    Plan:{
        type:String,
        required:true
    },

    payTime:{
        
    },
    EndTime:{
        
    },
    hashPassword:{

    },
   
    salt:{

    }
   
});
const Users=mongoose.model('Users',RegistrationSchema);
module.exports=Users;
