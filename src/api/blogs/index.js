import express from "express";
import q2m from "query-to-mongo";
import { checkBlogSchema, getbadRequest } from "./validator.js";
import { basicAuth } from "../../library/authentications/basicAuth.js";
import blogModel from "./model.js";
import commentModel from "../comments/model.js";

const blogRouter = express.Router();

blogRouter.post("/", checkBlogSchema, getbadRequest, async (request, response, next) => {
  try {
    const newBlog = new blogModel(request.body);
    await newBlog.save();
    response.status(200).send(newBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", basicAuth, async (request, response, next) => {
  try {
    const mongoQuerry = q2m(request.query);
    console.log("QUERY:", mongoQuerry);
    const blogs = await blogModel
      .find(mongoQuerry.criteria, mongoQuerry.options.fields)
      .limit(mongoQuerry.options.limit)
      .skip(mongoQuerry.options.skip)
      .sort(mongoQuerry.options.sort)
      .populate({ path: "comments" });
    response.status(200).send(blogs);
  } catch (error) {
    next(error);
  }
});
blogRouter.get("/myBlogs", basicAuth, async (request, response, next) => {
  try {
    response.status(200).send(request.user);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const blog = await blogModel.findById(id).populate({
      path: "comments",
    });
    response.status(200).send(blog);
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const editedBlog = await blogModel.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    response.status(200).send(editedBlog);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const blog = await blogModel.findByIdAndDelete(id);
    response.status(200).send("Deleted");
  } catch (error) {
    next(error);
  }
});

//----------------------------------------------------------------

blogRouter.post("/:id/comments", async (req, res, next) => {
  try {
    //const comment = await commentModel.findById(req.body.commentID, { _id: 0 });
    //const newComment2 = {content:req.body.content}
    const newComment = await new commentModel(req.body);
    console.log(newComment);
    if (newComment) {
      //const newComment = { ...comment.toObject(), updated: new Date() };
      const theBlog = await blogModel.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } }, { new: true, runValidators: true });

      if (theBlog) {
        await theBlog.save();
        res.send(theBlog);
      }
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:id/comments", async (req, res, next) => {
  const theBlog = await blogModel.findById(req.params.id);
  const comments = theBlog.comments;
  res.status(200).send(comments);
});
blogRouter.get("/:id/comments/:commentID", async (req, res, next) => {
  const theBlog = await blogModel.findById(req.params.id);
  const comments = theBlog.comments;
  const theComment = comments.find((comment) => comment._id.toString() === req.params.commentID);
  res.status(200).send(theComment);
});

blogRouter.put("/:id/comments/:commentID", async (req, res, next) => {
  const theBlog = await blogModel.findById(req.params.id);
  const comments = theBlog.comments;
  const index = comments.findIndex((comment) => comment._id.toString() === req.params.commentID);
  const oldComments = comments[index];

  const newComments = { ...oldComments.toObject(), ...req.body };
  comments[index] = newComments;
  await theBlog.save();

  res.status(200).send(newComments);
});

blogRouter.delete("/:id/comments/:commentID", async (req, res, next) => {
  const theBlog = await blogModel.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { comments: { _id: req.params.commentID } },
    },
    { new: true }
  );

  res.status(200).send(theBlog);
});

export default blogRouter;
