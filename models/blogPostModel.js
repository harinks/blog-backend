const mongoose = require('mongoose');
const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}

const BlogPostSchema = new mongoose.Schema({

    creater: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    title: {
        type: "string",
        required: true
    },

    content: {
        type: "string",
        required: true
    },

    image: {
        type: "string",
        required: true
    },

    category: {
        type: 'string',
        default: 'others'
    },

    created_at: {
        type: String,
        default: new Date().toLocaleDateString('en-IN', )
    }

})

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost