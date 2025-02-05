import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import logger from "./logger.js";

const app = express();

/*
  - Purpose: Configures Cross-Origin Resource Sharing (CORS) to allow or restrict client applications from making requests to your backend application.
  
  - Why This Matters: Helps prevent unauthorized access to the application by restricting which front-end applications can access its resources.
*/
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// ------ common middleware ------
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// ------ import routes ------
import { errorHandler } from "./middlewares/error.middlewares.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

// ------ routes ------
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use(errorHandler);

export { app };
