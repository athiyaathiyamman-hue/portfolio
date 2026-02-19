/* =========================
   Scroll Frame Animation
========================= */

const canvas = document.getElementById("scrollCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240; // total frames
const images = [];
const imageSeq = { frame: 1 };

function getFramePath(index) {
  const padded = String(index).padStart(3, '0');
  return `frames/egzil-frame-${padded}.jpg`;
}

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = getFramePath(i);
  images.push(img);
}

function render() {
  const img = images[imageSeq.frame - 1];
  if (!img) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const scale = Math.max(
    canvas.width / img.width,
    canvas.height / img.height
  );

  const x = (canvas.width / 2) - (img.width / 2) * scale;
  const y = (canvas.height / 2) - (img.height / 2) * scale;

  context.drawImage(img, x, y, img.width * scale, img.height * scale);
}

images[0].onload = render;

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScroll;
  const frameIndex = Math.min(
    frameCount,
    Math.ceil(scrollFraction * frameCount)
  );

  imageSeq.frame = frameIndex;
  requestAnimationFrame(render);
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
});


/* =========================
   Chatbot Widget
========================= */

const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");

/* STRICT SYSTEM PROMPT */
const SYSTEM_PROMPT = `
You are a Resume Assistant.
ONLY answer using the resume details below.
If the question is not related to the resume, reply:
"I can only answer questions related to the resume."

Resume Context:
Name: ATHIYAMAN B
Phone: 8220856258
Email: athiyaathiyamman@gmail.com
Location: Rajapalayam, Tamil Nadu
Education: BE - Electronics and Communication Engineering (3rd Year)
Skills: MS Word, Python, Communication, Leadership
Achievement: Football – State Player
Projects: Academic ECE coursework/projects
Hobbies: Football
`;

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.innerText = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  chatInput.value = "";

  addMessage("Thinking...", "bot");

  try {
    /* Replace with your API call */
    const response = await fakeChatbotReply(userText);

    chatMessages.lastChild.remove();
    addMessage(response, "bot");

  } catch (err) {
    chatMessages.lastChild.remove();
    addMessage("Error contacting assistant.", "bot");
  }
}

/* Demo fallback (local logic) */
function fakeChatbotReply(question) {
  return new Promise(resolve => {
    setTimeout(() => {
      const q = question.toLowerCase();

      if (q.includes("name")) resolve("My name is ATHIYAMAN B.");
      else if (q.includes("skill")) resolve("My skills include MS Word, Python, Communication, and Leadership.");
      else if (q.includes("education")) resolve("I am pursuing BE in Electronics and Communication Engineering, currently in 3rd Year.");
      else if (q.includes("achievement")) resolve("I am a Football – State Player.");
      else if (q.includes("hobby")) resolve("My hobby is Football.");
      else resolve("I can only answer questions related to the resume.");
    }, 500);
  });
}

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
