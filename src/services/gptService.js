import OpenAI from "openai";

export async function fetchDataFromAPI(prompt, apiKey) {
    const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: apiKey,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4-1106-preview",
        response_format: { "type": "json_object" }
    });

    return chatCompletion;
}
