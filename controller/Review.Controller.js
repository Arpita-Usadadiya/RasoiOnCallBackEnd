const Review = require("../model/Review.Model");
const Chef = require("../model/Chef.model");
const Booking = require("../model/Booking.Model");
const mongoose = require("mongoose");

// ADD REVIEW
exports.addReview = async (req,res)=>{
try{

const {userId,chefId,rating,comment} = req.body;

const review = await Review.create({
 chefId,
 userId,
 rating,
 comment
});


// calculate average rating
const reviews = await Review.find({chefId: new mongoose.Types.ObjectId(chefId)});

const avgRating =
reviews.reduce((acc,r)=>acc+r.rating,0) / reviews.length;


// update chef rating
await Chef.findByIdAndUpdate(chefId,{
 rating:avgRating.toFixed(1)
});

res.json({
 success:true,
 data:review
});

}catch(err){
 res.status(500).json({message:err.message});
}
};



// GET REVIEWS
exports.getChefReviews = async (req,res)=>{
try{

const reviews = await Review.find({
 chefId:req.params.chefId
})
.populate("userId","name")
.sort({likes:-1});


res.json({
 success:true,
 data:reviews,
 topReview:reviews[0]
});

}catch(err){
 res.status(500).json({message:err.message});
}
};



// LIKE REVIEW
exports.likeReview = async (req,res)=>{
try{

const review = await Review.findByIdAndUpdate(
 req.params.id,
 {$inc:{likes:1}},
 {new:true}
);

res.json({
 success:true,
 data:review
});

}catch(err){
 res.status(500).json({message:err.message});
}
};



// CHEF DASHBOARD REVIEWS
exports.getChefDashboardReviews = async (req,res)=>{
try{

const chefId = new mongoose.Types.ObjectId(req.params.chefId);

const reviews = await Review.find({chefId});

res.json({
 success:true,
 totalReviews:reviews.length,
 data:reviews
});

}catch(err){
 res.status(500).json({message:err.message});
}
};

exports.getRatingAnalytics = async (req, res) => {
  try {

     // find chef using logged in user
    const chef = await Chef.findOne({ userId: req.user.userId });

    if (!chef) {
      return res.json({
        success: true,
        data: []
      });
    }

    const chefId = chef._id;

    const ratings = await Review.aggregate([
      {
        $match: { chefId: chefId }
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formatted = ratings.map(r => ({
      rating: r._id + "⭐",
      count: r.count
    }));

     console.log("Formatted ratings:", formatted);

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getChefStats = async (req, res) => {
  try {

    const { chefId } = req.params;

    const reviews = await Review.find({ chefId });

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? (totalRating / totalReviews).toFixed(1)
        : 0;

    res.json({
      success: true,
      data: {
        averageRating,
        totalReviews
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching chef stats"
    });
  }
};