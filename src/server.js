import pino from "pino-http";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { initMongoConnection } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";
import columnRoutes from "./routes/column.routes.js";
import cardRoutes from "./routes/card.routes.js";
import helpRouter from "./routes/help.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

let mongoConnectionPromise;

const ensureMongoConnection = () => {
  if (!mongoConnectionPromise) {
    mongoConnectionPromise = initMongoConnection().catch((error) => {
      mongoConnectionPromise = undefined;
      throw error;
    });
  }

  return mongoConnectionPromise;
};

app.use(
  express.json({
    limit: "2mb",
    type: ["application/json", "application/vnd.api+json"],
  })
);

const logger = pino(
  process.env.VERCEL
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
);

app.use(logger);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Task Pro API is up and running! 🌹");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB bağlantısı
app.use(async (req, res, next) => {
  try {
    await ensureMongoConnection();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/help", helpRouter);

// Error handling
app.use(errorHandler);

// Vercel bunu kullanacak
export default app;

// Local, Render ve Back4app bunu kullanacak
export const setupServer = async () => {
  await ensureMongoConnection();

  return app.listen(port, () => {
    console.log(`Server is working on port ${port} 🌹`);

    console.log("📧 Email Configuration:", {
      SMTP_HOST: process.env.SMTP_HOST ? "✓ Set" : "❌ Not set",
      SMTP_PORT: process.env.SMTP_PORT ? "✓ Set" : "❌ Not set",
      SMTP_USER: process.env.SMTP_USER ? "✓ Set" : "❌ Not set",
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? "✓ Set" : "❌ Not set",
      SMTP_TO: process.env.SMTP_TO
        ? `✓ ${process.env.SMTP_TO}`
        : "❌ Not set",
    });
  });
};
