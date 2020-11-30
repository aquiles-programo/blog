const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blog_posts) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return blog_posts.length === 0
    ? 0
    : blog_posts.map(post => post.likes).reduce(reducer)
}

const favoriteBlog = blogs => {
  const mostLikes = Math.max(...(blogs.map(blog => blog.likes)))
  const blog = blogs.find(blog => blog.likes === mostLikes )
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}