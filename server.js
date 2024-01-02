const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const noteRoutes = require("./routes/noteRoute");

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api", noteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statuscode).json({
    statuscode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app;
