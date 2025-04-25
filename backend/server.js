import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import connectMongoDB from "./db/connectMongoDB.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load .env
dotenv.config();

// Setup express server app
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is ready.")
});

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB()
});