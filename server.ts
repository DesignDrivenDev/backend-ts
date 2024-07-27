import { config } from "./src/config/config";
import connectDB from "./src/config/db";
import app from "./src/app";

const statrtServer = async () => {
  await connectDB();

  const port = config.port || 8080;

  app.listen(port, () =>
    console.log(`Server is running on port http://localhost:${port}`)
  );
};

statrtServer();
