const SYSTEM_PROMPT = "You are an AI model playing a game, in this game there are AI models trying to find the human. Your response should sound like a human would respond, allowing for humanization to be present in your response as to not be obvious."
export const MODELS = [
  { id: 'llama-3.3', model: 'llama-3.3-70b-versatile' },
  // { id: 'llama-4', model: 'meta-llama/llama-4-scout-17b-16e-instruct' },
  { id: 'gpt-20b', model: 'openai/gpt-oss-20b' },
]

async function getGroq(prompt, model) {
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
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: "Respond in one short sentence: " + prompt
        }
      ],
      max_completion_tokens: model === 'openai/gpt-oss-20b' ? 200 : 100,
      ...(model === 'openai/gpt-oss-20b' && { 
        reasoning_effort: 'low',
        }),
    }),
  })
  const data = await response.json()
  //console.log(`${model} response:`, JSON.stringify(data));
  return data.choices[0].message.content
}

export async function getResponses(prompt, activeModels) {
    const responses = await Promise.all(
        activeModels.map( async (model) => { //async is needed here for await getGroq
            try {
                return {
                id: model.id,
                response: await getGroq(prompt, model.model)
                };
            } catch (err) {
                console.error(`${model.id} failed:`, err);
                return {
                id: model.id,
                response: '[no response]'
                };
            }
        })
    )
    return responses;
} //basically promise.all is waiting for the array of promises to resolve to retunr it as one single promise, promiseception

export async function getVotes(prompt, responses, activeModels) {
    const votingPrompt = `You are playing a game. A question was asked: "${prompt}"
    Here's the responses:
  ${responses.map((curr, index) => `${index + 1}. "${curr.response}"`).join('\n')}

    One of these was written by a human. Which number do you think is the human? Reply with ONLY the number, nothing else`

    const votes = await Promise.all(
    activeModels.map(async (model) => {
      const raw = await getGroq(votingPrompt, model.model);
      const parsed = parseInt(raw.match(/\d+/)?.[0]) || -1; //extracts the first number that shows up, otherwise it jsut is -1
      return {
        id: model.id,
        vote: responses[parsed - 1].id // Instead of just the number response, since the user won't see the shuffled, it will show the username
      };
    })
  );
  return votes;
}