const router = require('express').Router();
const BlogPost = require('../models/blogPostModel');
const authUser = require('../middleware/auth');

//create a blog
router.post('/blog/create', authUser, async (req, res) => {
    const { title, content, image } = req.body;
    try {
        const blog = await BlogPost.create({ title, content, image, creater: req.user._id })
        req.user.blogs.push(blog._id);
        await req.user.save();
        res.json(blog)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//get all blogs
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await BlogPost.find();
        res.json(blogs)
    } catch (error) {
        res.status(404).json(error.message);
    }
})

//get single user blogs
router.get('/blogs/me', authUser, async (req, res) => {
    try {
        const user = req.user;
        user.populate('blogs').then(({ blogs }) => res.json(blogs))
    } catch (error) {
        res.status(404).json(error.message);
    }
})

//get single blog
router.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await BlogPost.findById(id);
        blog.populate('creater').then(result => {
            res.json(result)
        })
    } catch (error) {
        res.status(404).json("Not found");
    }
})

//delete blog
router.delete('/blogs/:id', authUser, async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await BlogPost.findById(id);
        if (blog.creater.toString() === req.user._id.toString()) {
            await blog.remove();
            res.status(200).send();
        } else {
            res.status(401).json("Not Authorised User")
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.patch('/blogs/:id', authUser, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const blog = await BlogPost.findByIdAndUpdate(id, {title, content})
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = router;
