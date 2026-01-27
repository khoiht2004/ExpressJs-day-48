require("module-alias/register");
const cors = require("cors");
const express = require("express");
const {
  notFoundHandler,
  exceptionHandler,
  responseFormat,
} = require("@/middlewares");
const taskRouter = require("./src/routes/tasks.route");
const { apiRateLimiter } = require("./src/middlewares/rateLimiter");
const { createRateLimiter } = require("./src/middlewares/rateLimiter");

const app = express();

// Cấu hình CORS
const corsOptions = {
  origin: ["http://localhost:5173", "https://khoiht2004.github.io"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middlewares
app.use(responseFormat);

// Áp dụng rate limiter cho tất cả routes /api/*
app.use("/api", apiRateLimiter);

// Routes
app.use("/api", taskRouter);

// Test middlewares
app.get("/test-success", (req, res) => {
  res.success({ message: "Hello World" });
});
app.get("/test-error", (req, res) => {
  throw Error("Test exception");
});

// Test rate limiter với config nghiêm ngặt hơn (5 requests/phút)
const testRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 phút
  maxRequest: 5, // Chỉ cho phép 5 requests
  message: "Rate limit exceeded! You can only make 5 requests per minute.",
});

app.get("/test-rate-limit", testRateLimiter, (req, res) => {
  res.success({
    message: "Request successful!",
    info: "Try sending more than 5 requests within 1 minute to test rate limiting",
  });
});

// 404 và Error handlers cuối cùng
app.use(notFoundHandler);
app.use(exceptionHandler);

const port = 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
