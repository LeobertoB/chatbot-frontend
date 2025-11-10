export async function sendChatMessage(sessionId: string, question: string, chatHistory: any[] = []) {
    const response = await fetch("https://chatbot-backend-production-c162.up.railway.app/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            session_id: sessionId,
            question,
            chat_history: chatHistory
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to get response from backend.");
    }

    const data = await response.json();
    return data.answer;
}
