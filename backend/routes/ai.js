const express = require("express");
const router = express.Router();
const OpenAI = require("openai").default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/ai-design", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data[0].b64_json;

    res.json({
      image: `data:image/png;base64,${imageBase64}`,
    });

  } catch (error) {
    console.error("AI ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
