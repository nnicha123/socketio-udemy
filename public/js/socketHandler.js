import store from "./store.js";
import ui from "./ui.js";

let socket = null;

const connectToSocketIoServer = () => {
  socket = io("/");

  socket.on("connect", () => {
    console.log("Successfully connected: " + socket.id);
    store.setSocketId(socket.id);
    registerActiveSession();
  });

  socket.on("group-chat-message", (data) => {
    ui.appendGroupChatMessage(data);
  });

  socket.on("active-peers", (data) => {
    ui.updateActiveChatBoxes(data);
  });

  socket.on("direct-message", (data) => {
    ui.appendDirectChatMessage(data);
  });

  socket.on("peer-disconnected", (data) => {
    ui.removeChatboxOfDisconnectedPeer(data);
  });
};

const registerActiveSession = () => {
  const userData = {
    username: store.getUsername(),
  };

  socket.emit("register-new-user", userData);
};

const sendGroupChatMessage = (author, message) => {
  const messageData = {
    author,
    message,
  };
  //   client emits message
  socket.emit("group-chat-message", messageData);
};
const sendDirectMessage = (data) => {
  socket.emit("direct-message", data);
};

export default {
  connectToSocketIoServer,
  sendGroupChatMessage,
  sendDirectMessage,
};
