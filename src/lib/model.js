import { supabase } from './supabase.js'

export const MODELS = [
  { id: 'gpt-20b', provider: 'groq', model: 'openai/gpt-oss-20b' },
  { id: 'qwen', provider: 'groq', model: 'qwen/qwen3.6-27b' },
  { id: 'llama-70b', provider: 'groq', model: 'llama-3.3-70b-versatile' },
  { id: 'claude', provider: 'anthropic', model: 'claude-haiku-4-5' },
  { id: 'gpt-120b', provider: 'groq', model: 'openai/gpt-oss-120b' },
]

async function getResponse(prompt, model) {
  const { data, error } = await supabase.functions.invoke('models', {
    body: { provider: model.provider, model: model.model, prompt },
  })
  if (error) throw error
  if (data.error) throw new Error(data.error)
  return data.text
}

export async function getResponses(prompt) {
    const responses = await Promise.all(
        MODELS.map( async (model) => { //async is needed here for await getGroq
            try {
                return {
                id: model.id,
                response: await getResponse(prompt, model)
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

export async function getVotes(prompt, responses, question) {
  const votingPrompt =
    `${responses.length} responses to "${question}" are below. ${responses.length - 1} were written
    by AI models. One was written by a human trying to sound
    like an AI. Identify the human.

    The human will probably fail in one of these ways: they will
    be too short, too specific, too committed, or accidentally
    casual. Or they will overcorrect and sound MORE like a
    stereotype of AI writing than any real AI would.

    Responses:
    ${responses.map((curr, index) => `${index + 1}. "${curr.response}"`).join('\n')}

    Reply in this exact format:
    NUMBER
    REASON: one sentence explaining why`

  const votes = await Promise.all(
    MODELS.map(async (model) => {
      try {
        const raw = await getResponse(votingPrompt, model);
        const nums = raw.match(/\d+/g)
        const parsed = nums ? parseInt(nums[nums.length - 1]) : -1
        const reasonMatch = raw.match(/REASON:\s*(.+)/i);
        const explanation = reasonMatch ? reasonMatch[1].trim() : raw;
        return {
          id: model.id,
          vote: responses[parsed - 1]?.id || -1,
          explanation,
        };
      } catch (err) {
        console.error(`${model.id} vote failed:`, err)
        return {
          id: model.id,
          vote: -1,
          explanation: '' 
        }
      };
    })
  )
  return votes
}