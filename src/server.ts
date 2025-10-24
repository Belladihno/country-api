import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/app.config";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV !== "test") {
  app.use(morgan(config.NODE_ENV === "production" ? "combined" : "dev"));
}

(async () => {
  try {

    app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: "error",
        message: `Can't find ${req.originalUrl} on this server!`,
      });
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("Unhandled error:", err);
      res.status(500).json({
        status: "error",
        message: err.message || "Internal server error",
      });
    });

    app.listen(config.port, () => {
      console.info(`server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();