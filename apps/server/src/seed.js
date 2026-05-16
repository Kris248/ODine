import { runSeed } from "./seeders/index.js";

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
