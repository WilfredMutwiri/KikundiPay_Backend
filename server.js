require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5001;
const app = express();
const mongoose = require("mongoose");
const router = require("./src/routes");
const http=require("http");
const {Server}=require("socket.io");

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

// socket connection
const socketServer=http.createServer(app);

const io=new Server(socketServer,{
  cors:{
    origin:"*"
  }
})

app.set("io",io);

// connect
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("hello", (data) => {
    console.log("Client says hello:", data);
  });

  socket.emit("notification", {
    title: "✨ Welcome Back to KikundiPay",
    message: "Your onestop group management.",
  });

  socket.broadcast.emit("notification", {
    title: "New User",
    message: `A new user has joined (ID: ${socket.id})`,
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// connect to mongodb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to db");
  } catch (error) {
    console.log("Connection to db failed", error);
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

//run server
const server=socketServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
});
