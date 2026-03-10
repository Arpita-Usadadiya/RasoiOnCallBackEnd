const router = require("express").Router();
const { verifyToken, isChef } = require("../middleware/Auth.Middleware");
const reviewController = require("../controller/Review.Controller");

router.post("/add",reviewController.addReview);

router.get("/chef/:chefId",reviewController.getChefReviews);

router.patch("/like/:id",reviewController.likeReview);

router.get("/chef-stats/:chefId", reviewController.getChefStats);

router.get(
"/dashboard-ratings", verifyToken, isChef,
reviewController.getRatingAnalytics
);

module.exports = router;