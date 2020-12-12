const blogsRouter = require('express').Router()
const Blog  = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const token = req.token
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)


  const blog = new Blog({
    title: req.body.title,
    author: user.username,
    url: req.body.url,
    likes: req.body.likes,
    user: user._id
  })
  const result = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  res.status(201).json(result)

})

blogsRouter.delete('/:id', async (req, res) => {
  const token = req.token
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const blog = await Blog.findById(req.params.id)

  if (blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    return res.status(401).json({ error: 'only creator can delete his blogs' })
  }

})

blogsRouter.put('/:id', async (request, res) => {
  const body = request.body
  console.log(body)
  const blog = {
    likes: body.likes,
    title: body.title,
    author: body.author,
    url: body.url
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  res.json(updatedBlog)
})

module.exports = blogsRouter