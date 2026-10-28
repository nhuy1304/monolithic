import express from "express";
import dotenv from "dotenv";
import { db } from "./prisma/db.js";
import authMiddleware from "./middleware/authMiddleware.js";
import roleRoutes from "./routes/roleRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import orderDetailRoutes from "./routes/orderDetailRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check - không cần JWT
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "monolithic-api",
  });
});

// Đăng nhập - không cần JWT
app.use("/auth", authRoutes);

// Các API phía dưới phải có JWT
app.use(authMiddleware);

// Role routes
app.use("/roles", roleRoutes);

// Membership routes
app.use("/memberships", membershipRoutes);

// User routes
app.use("/users", userRoutes);

// Product routes
app.use("/products", productRoutes);

// Order routes
app.use("/orders", orderRoutes);

// Shipment routes
app.use("/shipments", shipmentRoutes);

// OrderDetail routes
app.use("/order-details", orderDetailRoutes);

try {
  await db.connect();
  console.log("Database connected successfully");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}