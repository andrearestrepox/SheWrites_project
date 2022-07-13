const { Schema, model } = require("mongoose");


const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String, 
            required: true
        }, 
        imageUrl: {
            type: String
        }, 
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      comments: [{
        type: Schema.Types.ObjectId, 
        ref: 'Comment'
      }]
    },
    {
        timestamps: true
    }
);

const Post = model("Post", postSchema);
module.exports = Post;