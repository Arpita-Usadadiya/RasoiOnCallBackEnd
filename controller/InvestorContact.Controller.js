const { cloudinary } = require("../config/cloudinary");

const InvestorContact=require("../model/InvestorContact.Model")
//create a new blog post with the provided data

const createInvestContact = async (req, res) => {
    try {
      const { fullname,email,city,message } = req.body;
  
      // Check if contact already exists using Email
      const existingData = await InvestorContact.findOne({ email });
  
      if (existingData) {
        return res.status(400).json({ message: "This InvestorContact already exists" });
      }
  
      const newInvestor = new InvestorContact({
        fullname,
        email,
        city,
        message,
      });
  
      await newInvestor.save();
  
      res.status(201).json({
        message: "InvestorContact is successfully created",
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  


const getallInvestorContact = async (req, res) => {
  try {
    const Investors = await InvestorContact.find();

    if (!Investors.length) {
      return res.status(404).json({ message: "No Investor posts found" });
    }
    
    res.status(200).json(Investors ); // Corrected from "blog" to "blogs"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};





module.exports={
    createInvestContact,
    getallInvestorContact
   
};