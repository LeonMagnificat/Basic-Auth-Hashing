import atob from "atob";
import UserModel from "../../api/users/model.js";
import createHttpError from "http-errors";

export const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401), "Invalid");
  } else {
    const encodedCredeantials = req.headers.authorization.split(" ")[1];

    //console.log("encodedCredeantials:", encodedCredeantials);

    const creadentials = atob(encodedCredeantials).split(":");
    const [email, password] = creadentials;

    //console.log("creadentials:", creadentials);
    console.log("email:", email);
    console.log("password", password);

    const user = await UserModel.checkUserExistance(email, password);
    if (!user) {
      next(createHttpError(401, "Invalid"));
    } else {
      req.user = user;
      next();
    }
  }
};
