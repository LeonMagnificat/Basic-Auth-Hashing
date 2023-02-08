import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true },
    role: { type: "string", required: true },
    blogs: [{ type: Schema.Types.ObjectId, ref: "blog" }],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainText = currentUser.password;
    const hashedPW = await bcrypt.hash(plainText, 11);
    currentUser.password = hashedPW;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const currentUser = this;
  const currentUserObject = currentUser.toObject();
  delete currentUserObject.password;
  delete currentUserObject.__v;
  return currentUserObject;
};

userSchema.static("checkUserExistance", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    return null;
  } else {
    const checkPasswordMatch = await bcrypt.compare(password, user.password);

    console.log("PW:", password, "PW2:", user.password, checkPasswordMatch);
    if (checkPasswordMatch) {
      return user;
    } else {
      return null;
    }
  }
});

export default model("user", userSchema);
