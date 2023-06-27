const express = require("express");
const http = require("http");
// par anticipation, on installe les cors.
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const port = 5050;

io.on("connection", (socket) => {
  console.log("New user : ", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("newMessage", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
  });
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`server is listening on port ${port}`);
});
