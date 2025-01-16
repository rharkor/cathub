import express, { Request, Response } from "express";
const app = express();

// database connections

// routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const APP_PORT = process.env.PORT || 3001;

app.listen(APP_PORT, () => {
  console.log(`Server started on port ${APP_PORT}`);
});
