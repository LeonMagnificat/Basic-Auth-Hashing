import { body, checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogSchema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is required and must be a string",
    },
  },
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is required and must be a string",
    },
  },
};

export const checkBlogSchema = checkSchema(blogSchema);

export const getbadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log("MESSAGE", errors.array());
  if (errors.isEmpty()) {
    next();
  } else {
    next(createHttpError(400, "Something went wrong", { errorsList: errors.array() }));
  }
};
