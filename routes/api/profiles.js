var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var auth = require('../auth');


router.post('/users/message', function (req, res, next) {
  var comment = new Comment();
  if (!req.body.data.message) {
    return res.status(422).json({ errors: { message: "Message can't be blank" } });
  }

  if (!req.body.data.userId) {
    return res.status(422).json({ errors: { userId: "UserId can't be blank" } });
  }
  comment.body = req.body.data.message;
  comment.author = req.body.data.userId;
  comment.save().then(async (comment, error) => {
    let updateCommentUser = await User.findOneAndUpdate({ _id: req.body.data.userId }, { $push: { commentId: comment._id }, new: true })
    return res.json({ comment: comment });
  }).catch(next);
});


router.post('/users/fetchMessage', function (req, res, next) {

  var messageList = [];

  for (var i = 0; i < 10; i++) {
    messageList.push({message: "Random string", val: i })
  }

  return res.status(201).json({ data:  messageList});

});

router.post('/users/post', async (req, res, next) => {
  console.log("req", req.body);
  // var user = new User();
  // var comment = new Comment();
  if (!req.body.data.userId) {
    return res.status(422).json({ errors: { userId: "UserId can't be blank" } });
  }
  console.log("comment 33", Comment);
  Comment.find({ author: req.body.data.userId })
    .exec((err, product) => {
      console.log(err, product);
      return res.json({ product: product });
    }).catch(next);
});


module.exports = router;
