import express from "express";
import multer from "multer";

import { getBlogs, addBlogs, saveCover } from "../../library/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post("/single", multer().single("cover"), async (req, res, next) => {
  try {
    const coverName = req.file.originalname;
    console.log(req);
    await saveCover(coverName, req.file.buffer);
    const url = `localhost:3001/image/blogs/${coverName}`;

    const blogs = await getBlogs();

    const blogindex = blogs.findIndex((blog) => blog.id === req.params.id);
    if (blogindex !== -1) {
      const oldBlog = blogs[blogindex];
      const newBlog = { ...oldBlog, cover: url, updated: new Date() };
      blogs[blogindex] = newBlog;

      await addBlogs(blogs);
    }
    res.send({ Message: "file added" });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
