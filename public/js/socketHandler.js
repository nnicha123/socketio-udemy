import ui from "./ui.js";

let socket = null;

const connectToSocketIoServer = () => {
  socket = io("/");

  socket.on("connect", () => {
    console.log("Successfully connected: " + socket.id);
  });

  socket.on("group-chat-message", (data) => {
    ui.appendGroupChatMessage(data);
  });
};

const sendGroupChatMessage = (author, message) => {
  const messageData = {
    author,
    message,
  };
  //   client emits message
  socket.emit("group-chat-message", messageData);
};

export default { connectToSocketIoServer, sendGroupChatMessage };
