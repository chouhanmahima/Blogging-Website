const express = require("express");

const postController = require("../controllers/post");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/***************************COMMENTS ROUTES************************************/
// 1. Retrieve all Posts
router.get("/", postController.listPosts);

// 2. Create a New Post
router.post("/", postController.createPost);

// 3. Retrieve a specific post by ID
router.get("/:id", postController.getPostById);

// 4. Update an existing Post
router.put("/:id", postController.editPost);

// 5. Delete a post by ID
router.delete("/:id", postController.deletePost);

/***************************COMMENTS ROUTES************************************/
// 1. Create new comment by Id
router.post("/comments/:postId", postController.postComment);

// 2. Update comment by Id
router.put("/comments/:postId/:commentId", postController.updateComment);

// 3. Delete comment by Id
router.delete("/comments/:postId/:commentId", postController.deleteComment);



module.exports = router;