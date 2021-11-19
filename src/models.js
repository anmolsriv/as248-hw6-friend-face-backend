const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'ID is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    salt: {
        type: String,
        required: [true, 'Salt is required']
    },
    hash: {
        type: String,
        required: [true, 'Hash is required']
    }
})
const profileSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'ID is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    zipcode: {
        type: Number,
        required: [true, 'Zipcode is required']
    },
    dob: {
        type: Date,
        required: [true, 'DOB is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    headline: {
        type: String
    },
    avatar: {
        type: String
    },
    displayname: {
        type: String
    },
    following: {
        type: [ String ],
        required: [true, 'Following is required']
    },
    created: {
        type: Date,
        required: [true, 'Created date is required']
    }
})

const commentSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'ID is required']
    },
    username: {
        type: String,
        required: [true, 'author is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    }
})

const articleSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, 'ID is required']
    },
    author: {
        type: String,
        required: [true, 'author is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    img: {
        type: String
    },
    comments: [ commentSchema ]
})


module.exports = {
    userSchema: userSchema,
    profileSchema: profileSchema,
    articleSchema: articleSchema,
    commentSchema: commentSchema
}