const Post = require('../models/post.model')
const User = require('../models/User.model')
const Comments = require('../models/comments.model')
const router = require("express").Router();
const fileUploader = require('../config/cloudinary.config');

router.get('/post/create', (req, res, next) => {
    res.render('post.hbs')
})

// protect route at some point//

router.post('/post/create', fileUploader.single('post-header-image'), (req, res) => {
    const { title, content } = req.body;
    const myAuthorId = req.session.currentUser._id
  
    Post.create({ title, content, imageUrl: req.file.path, userId: myAuthorId })
      .then(newlyCreatedPostFromDB => {
        console.log(newlyCreatedPostFromDB);
        // res.redirect('/userProfile')
        return User.findByIdAndUpdate(myAuthorId, { $push: { posts: newlyCreatedPostFromDB._id } });
      })
      .then( () => res.redirect('/myPosts'))
      .catch(error => console.log(`Error while creating a new post: ${error}`));
  });

  router.get('/myPosts', (req ,res, next) => {
    const myUserId = req.session.currentUser._id
    User.findById(myUserId)
    .populate('posts')
    .then(userWithPosts => {
        console.log('Posts from the DB: ', userWithPosts);
        res.render('list.hbs', { posts: userWithPosts.posts})
    })
    .catch(err => {
        console.log(`Err while getting the posts from the DB: ${err}`);
        next(err)
    });
  });

  router.get('/post/:postId', (req, res, next) => {
    const { postId } = req.params;
    Post.findById(postId)
    .populate('userId')
    .then(foundPost =>{
        console.log(foundPost)
        res.render('details.post.hbs', foundPost)
    })
    .catch(err => {
        console.log(`Err while getting a single post from the DB: ${err}`);
        next(err);
    })
  })

  router.get('/post/:postId/edit', (req, res, next) => {
    const { postId } = req.params;
   
    Post.findById(postId)
      .then(postToEdit => {
        res.render('post-edit.hbs', { post: postToEdit});
        console.log(postToEdit);
      })
      .catch(error => next(error));
  });

  router.post('/post/:postId/edit' , (req,res,next) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    Post.findByIdAndUpdate(postId, {title, content}, { new: true})
    .then(updatedPost => {
        console.log(updatedPost)
        res.redirect(`/myPosts`)
    })
    .catch(error => next(error));
});

router.post('/post/:postId/delete', (req, res, next) => {
    const postId = req.params.postId;

    Post.findByIdAndDelete(postId)
    .then(() => res.redirect('/myposts'))
    .catch(error => next(error));
})

module.exports = router;