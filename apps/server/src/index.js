import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectDb } from "./db.js";

const { server } = createApp();

connectDb()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`ODine server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
