const { createChef, getAllChef, getById, updateChef, deleteCheftById, deleteAllChef, smartMatchChefs, chefsNearMe } = require('../controller/Chef.controller');
const Chef = require("../model/Chef.model");

const router = require('express').Router();


router.post('/createChef', createChef);
router.get('/getAll', getAllChef);
router.get('/get/:id', getById);
router.put('/update/:id', updateChef);
router.delete('/delete/:id', deleteCheftById);
router.delete('/delete', deleteAllChef);
router.get("/near-me", chefsNearMe);
router.get("/filter", async (req, res) => {
  const { minHygiene } = req.query;

  try {
    const chefs = await Chef.find({
      hygieneScore: { $gte: Number(minHygiene) }
    });

    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/smart-match", smartMatchChefs);



module.exports = router;