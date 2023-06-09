import { Request, Response } from "express";
import { findUser, validatePassword } from "../service/user.service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import config from "config";
import { get } from "lodash";
import SessionModel from "../models/session.model";

export async function createSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("userAgent") || "");

  // create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") }
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenTtl") }
  );

  // return access & refresh token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("accessTokenTtl") }
  );

  return accessToken;
}
