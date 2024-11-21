// Server side
const express = require("express");
const http = require("http");

const PORT = 5000;
const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  //   Emit event from server to client
  socket.emit("hello-client");

  //   Listener on server to the event hello-server
  socket.on("hello-server", () => {
    console.log("hello server");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});