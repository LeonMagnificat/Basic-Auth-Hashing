import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeFile, writeJSON } = fs;

const dataPATH = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicPATH = join(process.cwd(), "./public/image/blogs");

const blogJSONfilePath = join(dataPATH, "blog.json");
console.log("PATH:", blogJSONfilePath);
const authorsJSONfilePath = join(dataPATH, "authors.json");

export const getBlogs = () => readJSON(blogJSONfilePath);
export const addBlogs = (array) => writeJSON(blogJSONfilePath, array);

export const saveCover = (coverName, coverBuffer) => {
  writeFile(join(publicPATH, coverName), coverBuffer);
};
