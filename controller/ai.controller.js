const axios = require("axios");
require("dotenv").config();

const generateDescription = async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        message: "Idea is required",
      });
    }

    const prompt = `
Create a short and professional freelance project description.

Idea: ${idea}

Return response in this format only:

Title:
Description:
Required Skills:

Keep it concise and professional.
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    );

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: err.response?.data || err.message,
    });
  }
};

module.exports = { generateDescription };
