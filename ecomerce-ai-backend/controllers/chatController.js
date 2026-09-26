const { runChat } = require('../utils/chatbot');

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'message is required' });

    const reply = await runChat(message, req.user.id);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithBot };