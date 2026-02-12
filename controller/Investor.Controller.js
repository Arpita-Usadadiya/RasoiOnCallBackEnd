const { cloudinary } = require("../config/cloudinary");
const Investor = require("../model/Investor.Model");

//create a new blog post with the provided data

const createInvestor = async (req, res) => {
  try {
    const { title, subtitle,  description,image } = req.body;
 
    // check   if the blog is already exists
    const existingData=await Investor.findOne({title})

    if(existingData){
      return res.status(400).json({message:"This blog already exists"})
    }

    
    const newBlog = new Investor({
        title, subtitle,  description,image 
    });
    await newBlog.save();

    res.status(201).json({
      message: "Investor is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getallInvestor = async (req, res) => {
  try {
    const Investors = await Investor.find();

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


//getting a single blog
const getInvestorById = async (req, res) => {
  try {
    const { id } = req.params;

    const Investors = await Investor.findById(id); // Changed "blogs" to "blog"

    if (!Investors ) {
      return res.status(404).json({ message: "Investor  not found" });
    }
    res.status(200).json(Investors); // Now correctly returning "blog"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// update all blogs
const updateInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle,  description,image } = req.body;
    let imageUrl = "";
    //image uploading process
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }
    const updateinvestors = await Investor.findByIdAndUpdate(
      id,
      {
        title, subtitle,  description, 
        image: imageUrl,
      },
      { new: true }
    );

    if (!updateinvestors) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({
      message: "Investor is successfully updated successfully",
      updateInvestor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// // delete a blog post by id

const deleteInvestor = async (req, res) => {
  try {
    const { id } = req.params;
 

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }


    // Delete the blog
    const deleteInvestors = await Blog.findByIdAndDelete(id);

    res.status(200).json({
      message: "Investor successfully deleted",
      deleteInvestors,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createInvestor,
    getallInvestor,
    getInvestorById,
    updateInvestor,
    deleteInvestor
};