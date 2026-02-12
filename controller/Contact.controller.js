

const Contact = require("../model/Contact.Models");

//create a new blog post with the provided data

const createContact = async (req, res) => {
  try {
    const { name, phone, email, city ,area} = req.body;
    /// validation process
    if (!name || !phone || !email || !city || !area) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // check   if the blog is already exists
    const existingData=await Contact.findOne({name})

    if(existingData){
      return res.status(400).json({message:"This Contact already exists"})
    }

    
    const newContact = new Blog({
        name, phone, email, city ,area
    });
    await newContact.save();

    res.status(201).json({
      message: "Contact is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all blog posts
const getallContact = async (req, res) => {
  try {
    const Contacts = await Contact.find();

    if (!Contacts .length) {
      return res.status(404).json({ message: "No Contact posts found" });
    }
    
    res.status(200).json(Contacts); // Corrected from "blog" to "blogs"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createContact,
    getallContact,
   
};
