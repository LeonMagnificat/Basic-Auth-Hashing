import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: "string", required: true },
    title: { type: "string", required: true },
    cover: { type: "string", required: false },
    content: { type: "string", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  },
  { timestamps: true }
);

export default model("blog", blogSchema);
