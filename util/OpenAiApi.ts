import axios from 'axios';

interface OpenAiResponse {
    text: string
    errorMessage: string
    isError: boolean
}

export const getOpenAiResponse = async (apiKey: string, model: string, inputText: string): Promise<OpenAiResponse> => {

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: model,
            messages: [ { role: "user", content: inputText }],
            n: 1,
            stop: null,
            temperature: 0.7,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            }
        });

        return (
            {
                text: response.data.choices[0].message.content.trim(),
                errorMessage: '',
                isError: false,
            }
        )
    } catch (error) {
        return (
            {
                text: 'Error retrieving response.',
                errorMessage: `${error}`,
                isError: true,
            }
        )
    }
}
