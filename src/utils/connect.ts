import mongoose from "mongoose";
import config from "config";

function connect() {
  const dbUri = config.get<string>("dbUri");

  return mongoose
    .connect(dbUri)
    .then(() => {
      console.log("db connected...");
    })
    .catch((error) => {
      console.error("Could not connect...");
      process.exit(1);
    });
}

export default connect;
