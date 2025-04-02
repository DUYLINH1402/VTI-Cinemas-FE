export async function sendMessageToChatbot(message) {
  const response = await fetch("https://vticinema-zalopay-test.vercel.app/chatbot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const text = await response.text(); // Lấy dữ liệu dạng text để debug
    console.error("Server response:", text);
    throw new Error(
      `Failed to get response from chatbot: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.response;
}
