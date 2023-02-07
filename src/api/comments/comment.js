import express from "express";
import q2m from "query-to-mongo";
import commentModel from "./model.js";

const commentRouter = express.Router();

commentRouter.post("/", async (request, response, next) => {
  try {
    const newComment = new commentModel(request.body);
    await newComment.save();
    response.status(200).send(newComment);
  } catch (error) {
    next(error);
  }
});

export default commentRouter;
