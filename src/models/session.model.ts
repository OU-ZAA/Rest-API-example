import mongoose from "mongoose";
import { userDocument } from "./user.model";
import { boolean, string } from "zod";

export interface SessionDocument extends mongoose.Document {
  user: userDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const sessionModel = mongoose.model("session", sessionSchema);

export default sessionModel;
