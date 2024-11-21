let username;
let socketId;
let activeChatboxes = [];

const getUsername = () => {
  return username;
};

const setUsername = (name) => {
  username = name;
};

const getSocketId = () => {
  return socketId;
};

const setSocketId = (id) => {
  socketId = id;
};

const getActiveChatboxes = () => {
  return activeChatboxes;
};

const setActiveChatboxes = (chatboxes) => {
  activeChatboxes = chatboxes;
};
export default {
  getUsername,
  setUsername,
  getSocketId,
  setSocketId,
  getActiveChatboxes,
  setActiveChatboxes,
};
