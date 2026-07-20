import cors from "cors";
import express from "express";
import { candidatesRouter } from "./routes/candidates";
import { healthRouter } from "./routes/health";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(healthRouter);
app.use(candidatesRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
