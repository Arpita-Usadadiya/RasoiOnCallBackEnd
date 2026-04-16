const { cloudinary } = require("../config/cloudinary");
const Chef = require("../model/Chef.model");
const Booking = require("../model/Booking.Model");
const { mongoose } = require("mongoose");


//chefs near me
const chefsNearMe = async (req, res) => {
  try {
    const { city } = req.query;

    const chefs = city
  ? await Chef.find({  city: { $regex: city, $options: "i" } })
  : await Chef.find();


    res.status(200).json({
      message: "Chefs near you",
      data: chefs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//recommend
const recommendFromBookings = async (req, res) => {
  try {

    const userId = req.user.userId;

    // get user's previous bookings
    const bookings = await Booking.find({ userId }).populate("chefId");

    if (bookings.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    // get most frequently booked chef cuisines
    const cuisineCount = {};

    bookings.forEach((b) => {
      const cuisine = b.chefId?.cuisine;

      if (!cuisine) return;

      cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
    });

    // sort cuisines by frequency
    const preferredCuisines = Object.keys(cuisineCount).sort(
      (a, b) => cuisineCount[b] - cuisineCount[a]
    );

    // get chefs with those cuisines
    const chefs = await Chef.find({
      cuisine: { $in: preferredCuisines }
    })
      .sort({ rating: -1 })
      .limit(5);

    res.json({
      success: true,
      data: chefs
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error getting recommendations"
    });

  }
};

//smart-match

const smartMatchChefs = async (req, res) => {
  try {
    const {
      cuisine,
      spiceLevel,
      maxPrice,
      availability,
      rating,
      search,
      sort
    } = req.query;

    let query = {};

    // Cuisine filter
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: "i" };
    }

    // Spice level filter
    if (spiceLevel) {
      query.spiceLevel = spiceLevel;
    }

    // Price filter
    if (maxPrice) {
      query.pricePerDay = { $lte: Number(maxPrice) };
    }

    // Availability filter
    if (availability === "true") {
      query.availability = true;
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Search by chef name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let chefsQuery = Chef.find(query);

    // Sorting
    if (sort === "priceLow") {
      chefsQuery = chefsQuery.sort({ pricePerDay: 1 });
    }

    if (sort === "priceHigh") {
      chefsQuery = chefsQuery.sort({ pricePerDay: -1 });
    }

    if (sort === "ratingHigh") {
      chefsQuery = chefsQuery.sort({ rating: -1 });
    }

    const chefs = await chefsQuery;

    res.status(200).json({
      success: true,
      results: chefs.length,
      data: chefs,
    });

  } catch (error) {
    console.error("Smart match error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//create a chef
const createChef = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user.userId);

    const existingChef = await Chef.findOne({ userId });

    if (existingChef) {
      return res.status(400).json({
        message: "Chef profile already exists for this user",
      });
    }

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
      cuisine,
      spiceLevel,
      pricePerDay,
      hygieneScore,
      availability
    } = req.body;

    const newChef = new Chef({
      
      userId: req.user.userId,
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
      cuisine,
      spiceLevel,
      pricePerDay,
      hygieneScore,
      availability
    });

    await newChef.save();

    res.status(201).json({
      message: "Chef profile created successfully",
      chef: newChef,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// const createChef = async (req, res) => {
//   try {
//    const {
//   name,
//   address,
//   profilepic,
//   city,
//   state,
//   area,
//   country,
//   pincode,
//   email,
//   phone,
//   experience,
//   cuisine,
//   spiceLevel,
//   pricePerDay,
//   hygieneScore,
//   availability
// } = req.body;

//     if (
//       !name ||
//       !address ||
//       !city ||
//       !state ||
//       !area ||
//       !country ||
//       !pincode ||
//       !email ||
//       !phone ||
//       !experience
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be filled" });
//     }
//     const existingChef = await Chef.findOne({ email: email });
//     if (existingChef) {
//       return res.status(400).json({ message: "Chef already exists" });
//     }
    
//     const newChef = new Chef({
//   name,
//   address,
//   city,
//   state,
//   area,
//   country,
//   pincode,
//   email,
//   phone,
//   experience,
//   profilepic,
//   cuisine,
//   spiceLevel,
//   pricePerDay,
//   hygieneScore,
//   availability
// });

//     await newChef.save();
//     res.status(200).json({
//       message: "Chef created Successfully",
//       chef: newChef,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };



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
        profilepic: profilepicUrl,
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

const getNearbyChefs = async (req, res) => {

  try {

    const { latitude, longitude } = req.query;

    const chefs = await User.find({
      role: "chef",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude)
            ]
          },
          $maxDistance: 5000   // 5 km
        }
      }
    });

    res.json({
      success: true,
      chefs
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error finding nearby chefs"
    });

  }

};

module.exports = { createChef, getAllChef, getById, updateChef, deleteCheftById, deleteAllChef, chefsNearMe, smartMatchChefs, getNearbyChefs, recommendFromBookings };
