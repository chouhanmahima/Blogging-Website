const PostsModel = require("../models/post");


/********************************************** POSTS *************************************************************/
// 1. Get list of All the Post
const listPosts = async (req, res) => {
  try {
    // Fetch Data through page no
    let pageNo = req.query.pageNo || 1;     // Number of page displayed in page
    let pageData = req.query.pageData || 10;        // Number of Data to be fetched
    pageNo = pageNo * 1;
    pageData = pageData * 1;
    // console.log(pageNo);

    // const PostsList = await PostsModel.find().populate("userId");   // To get all data of user
    const PostsList = await PostsModel.find({})
      .skip((pageNo - 1) * 10)
      .limit(pageData)            // Limit of Data to display
      .sort({ views: -1 })        // 1 ascending -1 descending
      .sort({ likes: -1 })
      .populate({                 // To get a specific Data of user (selected Data)
        path: "userId",
        select: "-_id name email role",
      })
    res.status(200).json({
      success: true,
      message: "Get All Posts-List API",
      results: PostsList,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "ERROR ! Data Not Found"
    });
  }
};

// 2. Create New Post
const createPost = async (req, res) => {
  // console.log(req.user._id);
  const newPost = new PostsModel({ ...req.body, userId: req.user._id });
  await newPost.save();  // save post in DB
  res.status(200).json({
    success: true,
    message: "Post Created Successfully !",
  });
};

// 3. Get Post by ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const postList = await PostsModel.findById(postId, req.body).populate({
      path: "userId",
      select: "-_id name email role",
    });

    res.status(200).json({
      success: true,
      message: "Get post by ID API",
      result: postList,
    });
  }
  catch (error) {
    res.status(404).json({
      success: false,
      message: "ERROR ! Data Not Found"
    });
  }
};

// 4. Edit Post by ID
const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostsModel.findByIdAndUpdate(postId, req.body);
    res.status(200).json({
      success: true,
      message: "Post Updated Successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "ERROR ! Data Not Found"
    });
  }
};

// 5. Delete Post By ID
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostsModel.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "Post Delete Successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "ERROR ! Data Not Found",
    });
  }
};

/********************************************** COMMENTS *************************************************************/
// 1. Create new comment by ID
const postComment = async (req, res) => {
  try {
    console.log(req.params.postId);
    await PostsModel.updateOne(
      { _id: req.params.postId },
      {
        $push: {
          comments: { comment: req.body.comment, userId: req.user._id },
        }
      });
    res.status(201).json({
      success: true,
      message: "Comment Posted Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred ! While creating the Comment.",
    });
  }
};

// 2. Update a comment by ID
const updateComment = async (req, res) => {
  try {
    console.log(req.params.postId);
    await PostsModel.updateOne(
      {
        _id: req.params.postId,
        "comments._id": req.params.commentId,
      },
      {
        $set: {
          "comments.$.comment": req.body.comment,
        }
      });
    res.status(200).json({
      success: true,
      message: "Comment Updated Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred ! While updating the Comment.",
    });
  }
};

// 3. Delete a comments by ID
const deleteComment = async (req, res) => {
  try {
    console.log(req.params.postId);
    await PostsModel.updateOne(
      { _id: req.params.postId },
      {
        $pull: {
          comments: { _id: req.params.commentId }
        }
      });
    res.status(200).json({
      success: true,
      message: "Comment Deleted Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred ! While deleting the Comment.",
    });
  }
};


const postController = {
  listPosts,
  createPost,
  getPostById,
  editPost,
  deletePost,
  postComment,
  updateComment,
  deleteComment,
}

module.exports = postController;