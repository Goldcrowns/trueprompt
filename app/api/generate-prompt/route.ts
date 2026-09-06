import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

const ALLOWED_MODELS = new Set([
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-flash-lite-latest',
])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = typeof body.input === 'string' ? body.input.trim() : ''
    const language = typeof body.language === 'string' ? body.language : 'English'
    const model = typeof body.model === 'string' ? body.model : 'gemini-flash-latest'

    if (!input || input.length > 5000) {
      return NextResponse.json({ error: 'Input must be between 1 and 5000 characters.' }, { status: 400 })
    }

    if (!ALLOWED_MODELS.has(model)) {
      return NextResponse.json({ error: 'Unsupported Gemini model.' }, { status: 400 })
    }

    const { text } = await generateText({
      model: google(model),
      system:
        'You are TruePrompt, an expert prompt engineer. Transform the user idea into one polished, reusable prompt. Return only the final prompt, with clear instructions and useful context. Do not explain your changes.',
      prompt: `Create a high-quality prompt from this idea:\n\n${input}\n\nThe final prompt must be written entirely in ${language}.`,
    })

    return NextResponse.json({ output: text })
  } catch {
    return NextResponse.json({ error: 'Gemini could not generate a prompt right now.' }, { status: 500 })
  }
}
