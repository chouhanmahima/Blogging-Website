const express = require("express");

const postController = require("../controllers/post");

const authMiddleware = require("../middlewares/auth")

const router = express.Router();

router.get("/", postController.listPosts);

router.post("/", authMiddleware ,postController.createPost);

module.exports = router;