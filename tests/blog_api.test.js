const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('../utils/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


const api = supertest(app)

describe('working with blogs', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const objects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promises = objects.map(async blog => blog.save())
    await Promise.all(promises)
  })

  test('blog posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should return +1 length when creating a blog post', async () => {
    const passwordHash = await bcrypt.hash('1113', 10)
    const user = new User({ username: 'uduran', name: 'Ulises Duran ', passwordHash: passwordHash })
    await user.save()
    const res = await api
      .post('/api/login')
      .send({ 'username': 'uduran', 'password': '1113' })

    const newBlog = {
      title: 'New Blog',
      author: 'You',
      url: 'mynewblog.com',
      likes: 90
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '+res.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogList = await helper.blogsFromDb()
    expect(updatedBlogList.length).toBe(helper.initialBlogs.length + 1)
  })

  test('should return 401 when a token is not provided', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'You',
      url: 'mynewblog.com',
      likes: 90
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)


  })

  test('should default likes to 0 when they are missing', async() => {
    const passwordHash = await bcrypt.hash('1113', 10)
    const user = new User({ username: 'uduran', name: 'Ulises Duran ', passwordHash: passwordHash })
    await user.save()
    const newBlog = {
      title: 'New Blog',
      author: 'You',
      url: 'mynewblog.com',
    }
    const res = await api
      .post('/api/login')
      .send({ 'username': 'uduran', 'password': '1113' })

    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '+res.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(savedBlog.body.likes).toBe('0')
  })

  test('should return 400 when title and url are missing', async () => {
    const passwordHash = await bcrypt.hash('1113', 10)
    const user = new User({ username: 'uduran', name: 'Ulises Duran ', passwordHash: passwordHash })
    await user.save()
    const newBlog = {
      author: 'You',
      liks: 203
    }
    const res = await api
      .post('/api/login')
      .send({ 'username': 'uduran', 'password': '1113' })

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer '+res.body.token)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('number of blog entries', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('should return identifier format as id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})