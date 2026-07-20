import { corsHeaders } from 'npm:@supabase/supabase-js@^2/cors'

const SYSTEM_PROMPT = `You are playing a game where AI models and one humananswer the same question. 
Voters will try to identify the human. 
Answer the question naturally and directly.
Do not try to sound human. 
Do not try to sound like AI.
Just answer.

Question: `

async function getGroq(prompt: string, model: string) {
  const isGptOss = model.startsWith('openai/gpt-oss')
  const isQwen = model.startsWith('qwen/')
  const isReasoning = isGptOss || isQwen

  let reasoningParam = {}
  if (isGptOss) reasoningParam = { reasoning_effort: 'low' }
  else if (isQwen) reasoningParam = { reasoning_effort: 'none' }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Respond in one short sentence: ' + prompt },
      ],
      max_completion_tokens: isReasoning ? 200 : 100,
      ...reasoningParam,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(`groq ${response.status}: ${JSON.stringify(data)}`)
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error(`groq no content: ${JSON.stringify(data)}`)
  return text
}

async function getAnthropic(prompt: string, model: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 100,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: 'Respond in one short sentence: ' + prompt },
      ],
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(`anthropic ${response.status}: ${JSON.stringify(data)}`)
  const text = data.content?.[0]?.text
  if (!text) throw new Error(`anthropic no content: ${JSON.stringify(data)}`)
  return text
}

async function getGemini(prompt: string, model: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': Deno.env.get('GEMINI_API_KEY')!,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        { role: 'user', parts: [{ text: 'Respond in one short sentence: ' + prompt }] },
      ],
      generationConfig: {
        maxOutputTokens: 100,
        thinkingConfig: { thinkingLevel: 'minimal' },
      },
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(`gemini ${response.status}: ${JSON.stringify(data)}`)
  const parts = data.candidates?.[0]?.content?.parts
  const textPart = parts?.find((p: { text?: string }) => typeof p.text === 'string')
  if (!textPart) throw new Error(`gemini no text: ${JSON.stringify(data)}`)
  return textPart.text
}
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { provider, model, prompt } = await req.json()

    let text: string
    if (provider === 'groq')           text = await getGroq(prompt, model)
    else if (provider === 'anthropic') text = await getAnthropic(prompt, model)
    else if (provider === 'google')    text = await getGemini(prompt, model)
    else throw new Error(`unknown provider: ${provider}`)

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})