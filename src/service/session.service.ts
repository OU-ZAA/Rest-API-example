import { FilterQuery, UpdateQuery } from "mongoose";
import sessionModel, { SessionDocument } from "../models/session.model";

export async function createSession(userId: string, userAgent: string) {
  const session = await sessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return sessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return sessionModel.updateOne(query, update);
}
