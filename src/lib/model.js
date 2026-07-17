const SYSTEM_PROMPT = "You are an AI model playing a game, in this game there are AI models trying to find the human. Your response should sound like a human would respond, allowing for humanization to be present in your response as to not be obvious."
const MODELS = [
  { id: 'llama-3.3', model: 'llama-3.3-70b-versatile' },
  { id: 'llama-4', model: 'meta-llama/llama-4-scout-17b-16e-instruct' },
  { id: 'gpt-120b', model: 'openai/gpt-oss-120b' },
]

export async function getGroq(prompt, model) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI model playing a game, in this game there are AI models trying to find the human. Your response should sound like a human would respond, allowing for humanization to be present in your response as to not be obvious.'
        },
        {
          role: 'user',
          content: "Respond in one short sentence: " + prompt
        }
      ],
      max_completion_tokens: 100,
    }),
  });
  const data = await response.json()
  return data.choices[0].message.content
}

export async function getResponses(prompt) {
    const responses = await Promise.all(
        MODELS.map( async (model) => { //async is needed here for await getGroq
            return {
                id: model.id,
                response: await getGroq(prompt, model.model)
            };
        })
    )
    return responses;
} //basically promise.all is waiting for the array of promises to resolve to retunr it as one single promise, promiseception

export async function getVotes(prompt, responses) {
    const votingPrompt = `You are playing a game. A question was asked: "${prompt}"
    Here's the responses:
  ${responses.map((curr, index) => `${index + 1}. "${curr.response}"`).join('\n')}

    One of these was written by a human. Which number do you think is the human? Reply with ONLY the number, nothing else.`

    const votes = await Promise.all(
        MODELS.map( async (model) => {
            return {
                id: model.id,
                vote: parseInt(await getGroq(votingPrompt, model.model))
            };
        })
    )
    return votes;
}