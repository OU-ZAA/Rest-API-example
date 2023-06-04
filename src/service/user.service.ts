import userModel, { userDocument } from "../models/user.model";
import { ObtainDocumentType } from "mongoose";

export async function createUser(
  input: ObtainDocumentType<
    Omit<userDocument, "createdAt" | "updateAt" | "comparePassowd">
  >
) {
  try {
    return await userModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}
