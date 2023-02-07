import express from "express";
import userRouter from "./api/users/index.js";
import blogRouter from "./api/blogs/index.js";
import commentRouter from "./api/comments/comment.js";
import filesRouter from "./api/files/index.js";
import listEndpoint from "list-endpoints-express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import { badRequestHandler, unauthorizedHandler, notFoundHandler, genericHandler } from "./errorHandler.js";
import mongoose from "mongoose";

const server = express();
const port = 3002;

const publicPATH = join(process.cwd(), "./public");

server.use(express.json());
server.use(express.static(publicPATH));
server.use(cors());

server.use("/users", userRouter);
server.use("/blogs", blogRouter);
server.use("/cover", filesRouter);
server.use("/comments", commentRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericHandler);

const mongoURL = process.env.MONGODB_URL;
console.log(`Mongo URL: ${mongoURL}`);

mongoose.connect(mongoURL);

mongoose.connection.on("connected", () => {
  console.log("DB Connected");
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.table(listEndpoints(server));
    console.table(listEndpoint(server));
  });
});
