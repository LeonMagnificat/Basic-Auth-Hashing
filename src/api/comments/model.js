import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: "string", required: true },
    rate: { type: "number", required: true, min: 1, max: 5 },
    commentDate: { type: "Date" },
  },

  { timestamps: true }
);

export default model("comment", commentSchema);
