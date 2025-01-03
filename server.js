const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Replace these values with your bot's information
const TELEGRAM_BOT_TOKEN = "7573739096:AAHCdIThW5L4OCjpV296ntf92kb-u9n_2JU"; // From BotFather
const TELEGRAM_CHAT_ID = "-4623513082"; // The recipient's chat ID

// Webhook endpoint for Dialogflow CX
app.post("/webhook", async (req, res) => {
  try {
    // Extract conversation details from Dialogflow CX payload
    const { queryResult, sessionInfo } = req.body;

    // Construct the message to send to Telegram
    const message = `
📝 *Conversation Log*:
👤 *User*: ${queryResult.text}
🤖 *Bot Response*: ${queryResult.responseMessages
      .map((msg) => msg.text.text[0])
      .join("\n")}

Session ID: ${sessionInfo.session}
`;

    // Send the message to Telegram
    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown", // Enables formatting for bold, italics, etc.
      }
    );

    console.log("Message sent to Telegram:", telegramResponse.data);

    // Respond to Dialogflow CX with a success message
    res.status(200).send({
      fulfillment_response: {
        messages: [{ text: { text: ["Message sent to Telegram!"] } }],
      },
    });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    res.status(500).send({
      fulfillment_response: {
        messages: [{ text: { text: ["Failed to send message to Telegram."] } }],
      },
    });
  }
});

// Start the webhook server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on http://localhost:${PORT}`);
});
