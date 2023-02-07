import express from "express";
import q2m from "query-to-mongo";
import UserModel from "./model.js";
import { basicAuth } from "../../library/authentications/basicAuth.js";
import blogModel from "../blogs/model.js";

const userRouter = express.Router();

userRouter.post("/", async (request, response, next) => {
  try {
    const newUser = new UserModel(request.body);
    await newUser.save();
    response.status(200).send(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", basicAuth, async (request, response, next) => {
  try {
    const Users = await UserModel.find().populate({ path: "blogs" });
    response.status(200).send(Users);
  } catch (error) {
    next(error);
  }
});
userRouter.get("/myProfile", basicAuth, async (request, response, next) => {
  try {
    const myProfile = await UserModel.findById(request.user._id).populate({ path: "blogs" });
    response.status(200).send(myProfile);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const User = await UserModel.findById(id);
    response.status(200).send(User);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const editedUser = await UserModel.findByIdAndUpdate(id, request.body, { new: true, runValidators: true });
    response.status(200).send(editedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;

    const User = await UserModel.findByIdAndDelete(id);
    response.status(200).send("Deleted");
  } catch (error) {
    next(error);
  }
});

//----------------------------------------------------------------

userRouter.post("/:userId/blogs", async (req, res, next) => {
  try {
    const newBlog = new blogModel(req.body);
    await newBlog.save();

    const blogID = newBlog._id;

    console.log(newBlog._id);

    const relatedUser = await UserModel.findByIdAndUpdate(req.params.userId, { $push: { blogs: blogID.toString() } }, { new: true, runValidators: true });

    await relatedUser.save();
    res.status(200).send(newBlog);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
