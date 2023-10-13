const express = require("express");
const chats = require("./data");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const env = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const userRouters = require("./routes/userRoutes");
const cloudinary = require("cloudinary");
const path = require("path");
// env.config();
connectDB();
app.use(
  cors({
    origin: "*",
  })
);

cloudinary.config({
  cloud_name: "dteyooywj",
  api_key: "953838524924364",
  api_secret: "qxlEAXI9SEmbH04AmudLTuRRdMk",
});

app.use(express.json());
app.use("/api/user", userRouters);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const PORTt = process.env.PORT || 5000;
const server = app.listen(PORTt, () => {
  console.log(`app is working woth port no. ${PORTt}`);
});

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User join room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    // console.log("newMessageRecieved", newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.to(user._id).emit("message recieved", newMessageRecieved);
      // console.log("revice dmes", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// io.on("connection", (socket) => {
//   console.log("connected to the socket");
// const onlineuser = [];
// const users = new Map();
//   socket.on("joinuser", (data) => {
//     users.set(data.id, { socket_id: socket.id });
//     users.forEach((it, i) => {
//       // console.log(it, i);
//       onlineuser.push(i);
//     });

//     console.log("users", users);
//   });

//   socket.emit("onlineuser", [...new Set(onlineuser)]);

//   socket.on("send-msg", (msg) => {
//     console.log(msg, "cdkjg", "ye kaam nhi kr rha", msg.id); //reciver_id, msg,file

//     let socketid = users.get(msg.id);

//     console.log("shubda", socketid);
//     if (socketid) {
//       socket.to(socketid.socket_id).emit("recve-msg", msg);
//     }
//   });
// });
