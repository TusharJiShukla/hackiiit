import express from "express";
import cors from "cors";

import dotenv from "dotenv";

import bodyParser from "body-parser";

const app = express();

import authRouter from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ move this import UP here

dotenv.config();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/auth", authRouter);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json("Welcome to the API!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
