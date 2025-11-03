export async function sendChatMessage(question: string, chatHistory: any[] = []) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
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
