const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===============================
// SUPPORT TEAM INFORMATION
// ===============================

const supportInfo = {
    name: "Harshitha Chandana",
    email: "harshithachandana2@gmail.com"
};

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// SUPPORT API
// ===============================

app.get("/api/support", (req, res) => {
    res.json(supportInfo);
});

// ===============================
// TICKET ROUTES
// ===============================

app.use("/api/tickets", require("./routes/ticketRoutes"));

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Mini Ticket Management System API is running!"
    });
});

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });