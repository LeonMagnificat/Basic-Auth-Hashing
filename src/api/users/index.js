import express, { response, Router } from "express";
import fs from "fs";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { fileURLToPath } from "url";

const currentPath = import.meta.url;
const currentPathtoURL = fileURLToPath(currentPath);
const parentPath = dirname(currentPathtoURL);

const authorsJSONfilePath = join(parentPath, "authors.json");

const authorsRouter = express.Router();

authorsRouter.post("/", (request, response) => {
  console.log("added author", request.body);
  const newAuthor = { ...request.body, date: new Date(), id: uniqid() };
  console.log("saved author", newAuthor);

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONfilePath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONfilePath, JSON.stringify(authorsArray));
  response.status(201).send(newAuthor);
});

authorsRouter.get("/", (request, response) => {
  const authorsbuffer = fs.readFileSync(authorsJSONfilePath);
  const allAuthors = JSON.parse(authorsbuffer);
  response.send(allAuthors);
});

authorsRouter.get("/:id", (request, response) => {
  const id = request.params.id;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONfilePath));
  const author = authorsArray.find((author) => author.id === id);
  response.send(author);
});

authorsRouter.put("/:id", (request, response) => {
  const id = request.params.id;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONfilePath));
  const editedAuthorIndex = authorsArray.findIndex((author) => author.id === id);
  const oldAuthor = authorsArray[editedAuthorIndex];
  const updatedAuthor = { ...oldAuthor, ...request.body, updated: new Date() };
  authorsArray[editedAuthorIndex] = updatedAuthor;
  fs.writeFileSync(authorsJSONfilePath, JSON.stringify(authorsArray));
  response.status(200).send(updatedAuthor);
});

authorsRouter.delete("/:id", (request, response) => {
  const id = request.params.id;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONfilePath));
  const remainigAuthors = authorsArray.filter((auth) => auth.id !== id);
  fs.writeFileSync(authorsJSONfilePath, JSON.stringify(remainigAuthors));
  response.status(200).send("deleted successfully");
});

export default authorsRouter;
