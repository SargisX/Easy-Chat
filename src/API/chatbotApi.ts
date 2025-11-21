import axios from "axios";

const URL = "https://apifreellm.com/api/chat";

export async function sendAiMessage(message: string) {
  try {
    const editedMessage: string = message.length >= 20 ? `${message}, write at least 50 words` : message
    const aiRes = await axios.post(
      URL,
      { message: message },
      { headers: { "Content-Type": "application/json" } }
    );

    if (aiRes.data.status === "success") {
      return {
        status: "success",
        reply: aiRes.data.response,
      };
    }

    return {
      status: "error",
      error: aiRes.data.error || "AI did not respond",
    };

  } catch (err: any) {
    return {
      status: "error",
      error: "Failed to reach AI service",
    };
  }
}
