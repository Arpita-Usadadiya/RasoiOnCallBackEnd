const { cloudinary } = require("../config/cloudinary");
const Blog = require("../model/Blog.Model");

//Create a New Blog Post with Image Upload
const createBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    //validation process
    if (!title || !content || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Create a new blog post with the provides data
    const newBlog = new Blog({
      title,
      content,
      category,
      image,
    });

    await newBlog.save();
    res.status(201).json({
      message: "Blog post created successfully",
      blog: {
        _id: newBlog._id,
        title: newBlog.title,
        content: newBlog.content,
        category: newBlog.category,
        image: newBlog.image,
      },
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
    let imageUrl;

    //image uploading process
    if (image && image.startsWith("data:image")) {

      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }
    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        image: imageUrl,
      },
      { new: true },
    );

    if (!updateBlog) {
      return res.status(500).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog successfully updated", updateBlog });
  } catch (error) {
    console.error("Error:", error);
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