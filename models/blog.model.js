const mongoose = require('mongoose')
const { estimatedReadingTime } = require('../helpers/readingTime.helper')

const blogModel = new mongoose.Schema( 

  {
    title: {
      type: String,
      required: true,
      unique: true
    },

    description: String,

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    owner: {
      type: String
    },

    state: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published']
    },

    read_count: {
      type: Number,
      default: 0
    },

    reading_time: Number,

    tags: [String],
    
    body: {
      type: String,
      required: true
  },

},

{ timestamps: true, }

)

// calculate reading time before saving document
blogModel.pre('save', function (next) {
  let Blog = this

  // calculate the time in minutes
  const timeToRead = estimatedReadingTime(this.body)

  Blog.reading_time = timeToRead
  next()
})

// calculate reading time before updating document
blogModel.pre('findOneAndUpdate', function (next) {
  let Blog = this._update

  // calculate the time in minutes
  if (Blog.body) {
    const timeToRead = estimatedReadingTime(Blog.body)
    Blog.reading_time = timeToRead
  }

  next()
})

blogModel.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.owner
  },
})

module.exports = mongoose.model('Blog', blogModel)
