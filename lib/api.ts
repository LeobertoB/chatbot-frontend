export async function sendChatMessage(question: string, chatHistory: any[] = []) {
    const response = await fetch("https://chatbot-philosophy.up.railway.app/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, chat_history: chatHistory }),
    });

    if (!response.ok) {
        throw new Error("Failed to get response from backend.");
    }

    const data = await response.json();
    return data.answer;
}