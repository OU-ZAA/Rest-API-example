import express from "express";
import config from "config";
import cors from "cors";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import cookieParser from "cookie-parser";

const port = config.get<number>("port");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: config.get<string>("origin"),
    credentials: true,
  })
);
app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);
});
