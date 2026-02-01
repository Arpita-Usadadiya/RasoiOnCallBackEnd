const { cloudinary } = require("../config/cloudinary");
const Chef = require("../model/Chef.model");
const { mongoose } = require("mongoose");

//create a chef
const createChef = async (req, res) => {
  try {
    const {
      name,
      address,
      profilepic,
      city,
      state,
      area,
      country,
      pincode,
      email,
      phone,
      experience,
    } = req.body;
    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !area ||
      !country ||
      !pincode ||
      !email ||
      !phone ||
      !experience
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    const existingChef = await Chef.findOne({ email: email });
    if (existingChef) {
      return res.status(400).json({ message: "Chef already exists" });
    }
    const newChef = new Chef({
      name,
      address,
      city,
      state,
      area,
      country,
      pincode,
      email,
      phone,
      experience,
      profilepic,
    });
    await newChef.save();
    res.status(200).json({
      message: "Chef created Successfully",
      chef: newChef,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all chefs
const getAllChef = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.status(200).json({
      message: "Chefs fetched successfully",
      data: chefs,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get chef by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const chef = await Chef.findById(id);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    res.status(200).json({
      message: "Chef fetched successfully",
      data: chef,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update chef
const updateChef = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      city,
      state,
      area,
      country,
      pincode,
      email,
      phone,
      experience,
      profilepic,
    } = req.body;
    let profilepicUrl = profilepic;
    if (profilepic && profilepic.startsWith("data:")) {
      const uploadResult = await cloudinary.uploader.upload(profilepic, {
        folder: "Chef",
      });
      profilepicUrl = uploadResult.secure_url;
    }
    const updatedChef = await Chef.findByIdAndUpdate(
      id,
      {
        name,
        address,
        city,
        state,
        area,
        country,
        pincode,
        email,
        phone,
        experience,
        profilepic,
      },
      { new: true },
    );

    if (!updatedChef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.status(200).json({
      message: "Chef updated successfully",
      data: updatedChef,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete chef by ID
const deleteCheftById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const chef = await Chef.findById(id);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }
    await Chef.findByIdAndDelete(id);
    res.status(200).json({ message: "Chef deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete all chefs
const deleteAllChef = async (req, res) => {
  try {
    await Chef.deleteMany();
    res.status(200).json({
      message: "All chefs deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createChef, getAllChef, getById, updateChef, deleteCheftById, deleteAllChef };
