
import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    tags: [String],
    summary: String,
    editedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);5

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    summary: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    versions: [versionSchema],   // history of edits
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;


