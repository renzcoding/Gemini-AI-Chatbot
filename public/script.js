const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";
  sendMessageToServer(userMessage);
});

async function sendMessageToServer(message) {
  appendMessage("bot", "Gemini is thinking...");

  console.log("testststs");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: [{ role: "user", text: message }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to get response from server.");
    }

    updateLastBotMessage(data.result);
  } catch (error) {
    updateLastBotMessage("Error: " + error.message);
    console.error(error);
  }
}

function updateLastBotMessage(text) {
  const messages = chatBox.querySelectorAll(".message.bot");
  if (messages.length > 0) {
    messages[messages.length - 1].textContent = text;
  } else {
    appendMessage("bot", text);
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
