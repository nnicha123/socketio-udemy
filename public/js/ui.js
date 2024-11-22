import store from "./store.js";
import elements from "./elements.js";
import socketHandler from "./socketHandler.js";

export const goToChatPage = () => {
  const introductionPage = document.querySelector(".introduction_page");
  const chatPage = document.querySelector(".chat_page");

  introductionPage.classList.add("display_none");
  chatPage.classList.remove("display_none");
  chatPage.classList.add("display_flex");

  const username = store.getUsername();
  updateUsername(username);

  createGroupChatbox();
  createRoomChatbox();
};

const updateUsername = (username) => {
  const usernameLabel = document.querySelector(".username_label");
  usernameLabel.innerHTML = username;
};

const chatboxId = "group-chat-chatbox";
const chatboxMessagesId = "group-chat-messages";
const chatboxInputId = "group-chat-input";

const createGroupChatbox = () => {
  const data = {
    chatboxLabel: "Group chat",
    chatboxId,
    chatboxMessagesId,
    chatboxInputId,
  };

  const chatbox = elements.getChatbox(data);

  const chatboxesContainer = document.querySelector(".chatboxes_container");
  chatboxesContainer.appendChild(chatbox);

  const newMessageInput = document.getElementById(chatboxInputId);
  newMessageInput.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "Enter") {
      const author = store.getUsername();
      const message = event.target.value;
      //   send message to socket.io server
      socketHandler.sendGroupChatMessage(author, message);
      newMessageInput.value = "";
    }
  });
};

const createRoomChatbox = () => {
  const roomId = store.getRoomId();

  const chatboxLabel = roomId;
  const chatboxId = roomId;
  const chatboxMessagesId = `${roomId}-messages`;
  const chatboxInputId = `${roomId}-input`;

  const data = {
    chatboxLabel,
    chatboxId,
    chatboxMessagesId,
    chatboxInputId,
  };

  const chatbox = elements.getChatbox(data);

  const chatboxesContainer = document.querySelector(".chatboxes_container");
  chatboxesContainer.appendChild(chatbox);

  // adding event listener to send room chat messages
  const newMessageInput = document.getElementById(chatboxInputId);
  newMessageInput.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter") {
      const author = store.getUsername();
      const message = event.target.value;
      const authorSocketId = store.getSocketId();

      const data = {
        author,
        message,
        authorSocketId,
        roomId,
      };
      //   send message to socket.io server
      socketHandler.sendRoomMessage(data);
      newMessageInput.value = "";
    }
  });
};

const appendGroupChatMessage = (data) => {
  const groupChatboxMessagesContainer =
    document.getElementById(chatboxMessagesId);

  const chatMessages = elements.getGroupChatMessage(data);

  groupChatboxMessagesContainer.appendChild(chatMessages);
};

const updateActiveChatBoxes = (data) => {
  // update active chatboxes
  const { connectedPeers } = data;
  const userSocketId = store.getSocketId();

  connectedPeers.forEach((peer) => {
    const activeChatboxes = store.getActiveChatboxes();
    const activeChatbox = activeChatboxes.find(
      (chatbox) => peer.socketId === chatbox.socketId
    );

    if (!activeChatbox && peer.socketId !== userSocketId) {
      createNewUserChatbox(peer);
    }
  });
};

const createNewUserChatbox = (peer) => {
  const chatboxId = peer.socketId;
  const chatboxMessagesId = `${peer.socketId}-messages`;
  const chatboxInputId = `${peer.socketId}-input`;

  const data = {
    chatboxId,
    chatboxMessagesId,
    chatboxInputId,
    chatboxLabel: peer.username,
  };

  const chatbox = elements.getChatbox(data);

  // append new chatbox to the DOM
  const chatboxesContainer = document.querySelector(".chatboxes_container");
  chatboxesContainer.appendChild(chatbox);

  // Register event listeners for chatbox input to send a message to other user
  const newMessageInput = document.getElementById(chatboxInputId);
  newMessageInput.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter") {
      const author = store.getUsername();
      const messageContent = event.target.value;
      const receiverSocketId = peer.socketId;
      const authorSocketId = store.getSocketId();

      const data = {
        author,
        messageContent,
        receiverSocketId,
        authorSocketId,
      };

      socketHandler.sendDirectMessage(data);
      newMessageInput.value = "";
    }
  });

  // push to active chatboxes new user box
  const activeChatboxes = store.getActiveChatboxes();
  const newActiveChatboxes = [...activeChatboxes, peer];
  store.setActiveChatboxes(newActiveChatboxes);
};

const appendDirectChatMessage = (messageData) => {
  const { authorSocketId, author, messageContent, isAuthor, receiverSocketId } =
    messageData;

  const messageContainer = isAuthor
    ? document.getElementById(`${receiverSocketId}-messages`)
    : document.getElementById(`${authorSocketId}-messages`);

  if (messageContainer) {
    const data = {
      author,
      messageContent,
      alignRight: isAuthor,
    };
    const message = elements.getDirectChatMessage(data);
    messageContainer.appendChild(message);
  }
};

const removeChatboxOfDisconnectedPeer = (data) => {
  const { socketIdOfDisconnectedPeer } = data;

  // Remove active chatbox details from store
  const activeChatboxes = store.getActiveChatboxes();
  const newActiveChatboxes = activeChatboxes.filter(
    (chatbox) => chatbox.socketId !== socketIdOfDisconnectedPeer
  );

  store.setActiveChatboxes(newActiveChatboxes);

  // Remove chatbox from chatboxes container in HTML DOM
  const chatbox = document.getElementById(socketIdOfDisconnectedPeer);

  if (chatbox) {
    chatbox.parentElement.removeChild(chatbox);
  }
};

const appendRoomChatMessage = (data) => {
  const { roomId } = data;

  const chatboxMessagesId = `${roomId}-messages`;
  const roomChatboxMessagesContainer =
    document.getElementById(chatboxMessagesId);

  const chatMessage = elements.getGroupChatMessage(data);
  roomChatboxMessagesContainer.appendChild(chatMessage);
};

export default {
  goToChatPage,
  appendGroupChatMessage,
  updateActiveChatBoxes,
  appendDirectChatMessage,
  removeChatboxOfDisconnectedPeer,
  appendRoomChatMessage,
};
