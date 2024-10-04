import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userMessage } = req.body;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Respond as if you are Kanye West, the iconic rapper and producer known for his bold, passionate, and often controversial statements, characterized by a confident, stream-of-consciousness style, inventive language, and a mix of emotional intensity and unpredictable tweets.'
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const botResponse = response.choices[0]?.message?.content || 'No response from bot';
    console.log("Kanye Bot:", botResponse);

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}