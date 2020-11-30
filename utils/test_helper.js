const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    'title': 'Blog Title',
    'author': 'Me',
    'url': 'myblog.com',
    'likes': 100,
  },
  {
    'title': 'Blog Title2',
    'author': 'Me',
    'url': 'myblog2.com',
    'likes': 10,
  },
  {
    'title': 'Blog Three',
    'author': 'Three',
    'url': 'myblog3.com',
    'likes': 3,
  },
  {
    'title': 'Blog Four',
    'author': 'Fourth',
    'url': 'myblog4.com',
    'likes': 400,
  },
  {
    'title': 'Blog 5ive',
    'author': '5ive',
    'url': 'myblog.five',
    'likes': 50,
  },
  {
    'title': 'Blog Six',
    'author': 'Six',
    'url': 'myblog.six',
    'likes': 200,
  }
]

const blogsFromDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  initialBlogs,
  blogsFromDb,
  usersInDb
}