const getChatbox = (data) => {
  const { chatboxLabel, chatboxMessagesId, chatboxInputId, chatboxId } = data;
  const chatBoxContainer = document.createElement("div");
  chatBoxContainer.classList.add("chatbox_container");
  chatBoxContainer.setAttribute("id", chatboxId);

  chatBoxContainer.innerHTML = `
    <div class="chatbox_label_container">
        <p class="chatbox_label">${chatboxLabel}</p>
    </div>
    <div class="messages_container" id="${chatboxMessagesId}">
    </div>
    <div class="new_message_input_container">
        <input type="text" class="new_message_input" id="${chatboxInputId}" placeholder="Type your message..."/>
    </div>
  `;

  return chatBoxContainer;
};

const getGroupChatMessage = (data) => {
  const { author, message } = data;
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_container");
  messageContainer.innerHTML = `
  <div class="message_container">
    <p class="message_paragraph">
        <span class="message_author">${author}: </span>${message}
    </p>
    </div>
  `;
  return messageContainer;
};

export default {
  getChatbox,
  getGroupChatMessage,
};
