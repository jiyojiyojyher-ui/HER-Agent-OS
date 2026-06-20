export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({ error: "POST 요청만 허용됩니다." });
    }

    const { question } = request.body;

    if (!question) {
        return response.status(400).json({ error: "질문이 없습니다." });
    }

    try {
        const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                input: question
            })
        });

        const data = await openaiResponse.json();

        return response.status(200).json({
            answer: data.output_text || "응답을 가져오지 못했습니다."
        });

    } catch (error) {
        return response.status(500).json({
            error: "AI 응답 처리 중 오류가 발생했습니다."
        });
    }
}