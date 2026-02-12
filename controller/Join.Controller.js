const { cloudinary } = require("../config/cloudinary");
const Join = require("../model/Join.Model");

//create a new blog post with the provided data

const createJoin = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    /// validation process
    if (!title || !content || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // check   if the blog is already exists
    const existingData=await Join.findOne({title})

    if(existingData){
      return res.status(400).json({message:"This content already exists"})
    }

    
    const newJoin = new Join({
      title,
      content,
      image,
    });
    await newJoin.save();

    res.status(201).json({
      message: "Join  is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all blog posts
const getallJoins = async (req, res) => {
  try {
    const Joins = await Join.find();

    if (!Joins.length) {
      return res.status(404).json({ message: "No Join posts found" });
    }
    
    res.status(200).json(Joins); // Corrected from "blog" to "blogs"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


//getting a single blog
const getJoinById = async (req, res) => {
  try {
    const { id } = req.params;

    const Joins = await Join.findById(id); // Changed "blogs" to "blog"

    if (!Joins) {
      return res.status(404).json({ message: "Join not found" });
    }
    res.status(200).json(Joins); // Now correctly returning "blog"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// // update all blogs
const updateJoins = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content,image } = req.body;
    let imageUrl = "";
    //image uploading process
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }
    const updateBlogs = await Join.findByIdAndUpdate(
      id,
      {
        title,
        content,
        image: imageUrl,
      },
      { new: true }
    );

    if (!updateBlogs) {
      return res.status(404).json({ message: "Join not found" });
    }

    res.status(200).json({
      message: "Joins  is successfully updated successfully",
      updateBlogs,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// // delete a blog post by id

const deleteJoin= async (req, res) => {
  try {
    const { id } = req.params;
 

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Check if the blog exists before deletion
    const existingJoin = await Join.findById(id);
    if (!existingJoin ) {
      return res.status(404).json({ message: "Join not found" });
    }

    // Delete the blog
    const deletedBlog = await Join.findByIdAndDelete(id);

    res.status(200).json({
      message: "Join successfully deleted",
      deletedBlog,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createJoin,
    getallJoins,
    getJoinById,
    updateJoins,
    deleteJoin
    // getallBlogs,
    // getBlogById,
    // updateBlog,
    // deleteBlog
};