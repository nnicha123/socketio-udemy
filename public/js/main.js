// Client side

const socket = io("/");

socket.on("connect", () => {
  console.log("Successfully connected: " + socket.id);
});

socket.on("hello-client", () => {
  console.log("hello-client");
  //   Emit from client to server
  socket.emit("hello-server");
});
