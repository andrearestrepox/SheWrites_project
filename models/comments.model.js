const { Schema, model } = require("mongoose");

const commentsSchema = new Schema ({
    body: {
        type: String,
        trim: true,
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now
    }, 
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
})


const Comments = model('Comments', commentsSchema)
module.exports = 'Comments';