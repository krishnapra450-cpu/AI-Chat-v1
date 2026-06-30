import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      reply: "Server Error"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
function searchChats() {

    const search = document
        .getElementById("search-chat")
        .value
        .toLowerCase();

    const chatItems = document.querySelectorAll(".chat-item");

    chatItems.forEach(item => {

        if (item.innerText.toLowerCase().includes(search)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }

    });

}
