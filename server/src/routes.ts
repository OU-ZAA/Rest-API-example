import { Express } from "express";
import {
  createUserHandler,
  getCurrentUser,
} from "./controller/user.controller";
import { createUserSchema } from "./schema/user.schema";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import requireUser from "./middleware/requireUser";

function routes(app: Express) {
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.get("/api/me", requireUser, getCurrentUser);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);
}

export default routes;
