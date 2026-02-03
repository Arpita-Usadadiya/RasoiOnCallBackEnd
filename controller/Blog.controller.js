const { cloudinary } = require("../config/cloudinary");
const Blog = require("../model/Blog.Model");

//Create a New Blog Post with Image Upload
const createBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageUrl = image;

    if (image.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      image: imageUrl,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog post created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


//get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    if (!blogs.length) {
      return res.status(404).json({ message: "No blog posts found" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Get Single blog Post by id
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "No blog posts found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//update blog post with image upload
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, image } = req.body;

    const updateData = { title, content, category };

    if (image && image.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      updateData.image = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({
      message: "Blog successfully updated",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete a blog post
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res
        .status(404)
        .json({ message: "No blog posts found", deletedBlog });
    }

    res.status(200).json({ mesage: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
};