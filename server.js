require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT=process.env.PORT || 5000
const app = express();
const mongoose = require("mongoose");
const router = require("./src/domains/user/routes");


app.use(express.json());
app.use(cors());
app.use("/api/v1",router);
// connect to mongodb
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to db")
    } catch (error) {
        console.log("Connection to db failed",error);
        process.exit(1);
    }
};
connectDB();

mongoose.connection.on("connected", () => {
    console.log("Mongoose successfully connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error(" Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
});


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
    console.error("Server error:", err.message);
});
