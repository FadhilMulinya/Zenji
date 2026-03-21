import express from "express";
import connectDb from "./database/connectDB.ts";
import { telegramService } from "./lib/telegram.ts";
import { ENV } from "./lib/environments.ts";
import { Logger } from "borgen";

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    app.listen(ENV.SERVER_PORT, () => {
      Logger.info({ message: `Server is running on port ${ENV.SERVER_PORT}` });
    });

    // Start Telegram Bot
    await telegramService.start();
  } catch (error) {
    Logger.error({ message: `Error starting server: ${error}` });
    process.exit(1);
  }
};

// Connect to Database and then start server
connectDb(startServer);

// Enable graceful stop
process.once("SIGINT", () => telegramService.stop("SIGINT"));
process.once("SIGTERM", () => telegramService.stop("SIGTERM"));



