import * as trpcExpress from "@trpc/server/adapters/express";
import express, { Request, Response } from "express";
import { appRouter, createContext } from "@cathub/api-routes";
import cors from "cors";
const app = express();

app.use(cors());

app.use((req, _res, next) => {
  // request logger
  console.log("⬅️ ", req.method, req.path);

  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.send("OK");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const APP_PORT = process.env.PORT || 3001;

app.listen(APP_PORT, () => {
  console.log(`Server started on port ${APP_PORT}`);
});
