const express = require("express");
const router = express.Router();

// load controller and validation modules
const commentController = require("../controllers/commentController");
const validation = require("./validation");

// create
router.post("/topics/:topicId/posts/:postId/comments/create",
  validation.validateComments,
  commentController.create);

// destroy
router.post("/topics/:topicId/posts/:postId/comments/:id/destroy",
  commentController.destroy);
module.exports = router;
