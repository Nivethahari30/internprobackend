var express = require("express");
var router = express.Router();
var RegistrationSchema = require("./Model/RegistrationSchema");
var bcrypt=require("bcrypt");
router.get("/", async function (req, res, next) {
  try {
    let UserList = await RegistrationSchema.find();
    res.json({
      status: "success",
      Data: UserList,
    });
  } catch (e) {
    res.json({
      status: "error",
      error: e.message,
    });
  }
});
// For email already exists url
router.post("/validation", async function (req, res, next) {
  console.log(req.body);
  try {
    const email=req.body.email;
    const Existingemail= await RegistrationSchema.findOne({email:email})
    if(Existingemail){
    res.status(200).json({
        status:"email already exists"
      })
    }
else{
  const data = new RegistrationSchema(req.body);
  // await data.save();
  res.status(201).json({ status: "success", message: "User registered successfully" });
} 
}
    
  catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  };
  
});

// / Submission page url
router.post("/", async function (req, res, next) {

  console.log(req.body)

  // const SelectedPlan=req.body.Plan
  const{name,email,Password,Plan}= req.body;

  // For hashed password and salt
  

  try{
     // Hash the password using bcrypt

    //  const hashedPassword = await bcrypt.hash(Password, 10);
    // const{hash,salt}=await hashPassword(Password);

    const payTime=new Date();
    let expiryTime;
    
    switch(Plan){
      case "Free":
        expiryTime=1
        break;
        case "Pro":
        expiryTime=7
        break;
        case "Advanced":
        expiryTime=30
        break;
        default:
         res.json({
          status:"no plan selected"
         })
    }
    const EndTime=  new Date(payTime.getTime()+expiryTime*24*60*60*1000);
    const salt=10;
    const hashedPassword=  await bcrypt.hash(Password,salt);

        
  
    const NewData=RegistrationSchema({
      name,
      email,
      
      hashPassword:hashedPassword ,
      Password,
      salt,
      Plan,
      payTime,
      EndTime
  
    })
    await NewData.save();
    res.json({
      status:"success",
      expiry:EndTime

    })
     
  
  
  }catch(e){
    console.log(e)
  }

});




module.exports = router;
