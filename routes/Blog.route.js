const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controller/Blog.controller');
const router = require('express').Router();


router.post('/create', createBlog);
router.get('/getAll', getAllBlogs);
router.get('/get/:id', getBlogById);
router.put('/update/:id', updateBlog);
router.put('/delete/:id', deleteBlog);


module.exports = router;