const { cloudinary } = require("../config/cloudinary");
const Connect = require("../model/Connect.Model");

//create a new blog post with the provided data

const createConnect = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    /// validation process
    if (!title || !content  || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // check   if the blog is already exists
    const existingData=await Connect.findOne({title})

    if(existingData){
      return res.status(400).json({message:"This blog already exists"})
    }

    
    const newBlog = new Connect({
      title,
      content,
      image,
    });
    await newBlog.save();

    res.status(201).json({
      message: "Connect is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all blog posts
const getallConnect = async (req, res) => {
  try {
    const Connects = await Connect.find();

    if (!Connects.length) {
      return res.status(404).json({ message: "No blog posts found" });
    }
    
    res.status(200).json(Connects); // Corrected from "blog" to "blogs"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


//getting a single blog
const getConnectById = async (req, res) => {
  try {
    const { id } = req.params;

    const Connects = await Connect.findById(id); // Changed "blogs" to "blog"

    if (!Connects) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog); // Now correctly returning "blog"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// update all blogs
const updateConnect = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content,  image } = req.body;
    let imageUrl = "";
    //image uploading process
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }
    const updateBlogs = await Connect.findByIdAndUpdate(
      id,
      {
        title,
        content,
    
        image: imageUrl,
      },
      { new: true }
    );

    if (!updateBlogs) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Connect  is successfully updated successfully",
      updateBlogs,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete a blog post by id

const deleteConnect = async (req, res) => {
  try {
    const { id } = req.params;
 

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }

    // Check if the blog exists before deletion
    const existingConnect = await Connect.findById(id);
    if (!existingConnect) {
      return res.status(404).json({ message: "Connect not found" });
    }

    // Delete the blog
    const deletedConnect = await Connect.findByIdAndDelete(id);

    res.status(200).json({
      message: "Connect successfully deleted",
      deletedConnect,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createConnect,
    getallConnect ,
    getConnectById,
    updateConnect,
    deleteConnect
};