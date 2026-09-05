'use client'

import { useMemo, useRef, useState } from 'react'

interface PromptExample {
  id: string
  label: string
  description: string
  seed: string
}

interface GeneratedPrompt {
  input: string
  output: string
  language: string
  model: string
}

interface SelectOption {
  value: string
  label: string
  description: string
}

const LANGUAGES: SelectOption[] = [
  { value: 'English', label: 'English', description: 'Generate in English' },
  { value: 'Türkçe', label: 'Türkçe', description: 'Türkçe üret' },
  { value: 'Español', label: 'Español', description: 'Generar en español' },
  { value: 'Deutsch', label: 'Deutsch', description: 'Auf Deutsch generieren' },
]

const MODELS: SelectOption[] = [
  { value: 'GPT-4o', label: 'GPT-4o', description: 'Balanced and versatile' },
  { value: 'Claude 3.5 Sonnet', label: 'Claude 3.5 Sonnet', description: 'Detailed and thoughtful' },
  { value: 'Gemini 1.5 Pro', label: 'Gemini 1.5 Pro', description: 'Fast and capable' },
]

const EXAMPLES: PromptExample[] = [
  {
    id: 'cv-generator',
    label: 'CV Generator',
    description: 'Craft a tailored, results-driven resume',
    seed: 'a professional CV for a senior product designer with 6 years of experience',
  },
  {
    id: 'job-interview',
    label: 'Job Interview',
    description: 'Prepare sharp answers and questions',
    seed: 'mock interview questions for a backend engineer role at a startup',
  },
  {
    id: 'recipe-creator',
    label: 'Recipe Creator',
    description: 'Turn ingredients into a full recipe',
    seed: 'a healthy 30-minute dinner recipe using chicken, spinach and rice',
  },
]

function buildPrompt(idea: string, language: string, model: string): string {
  const clean = idea.trim()
  return [
    `You are an expert assistant powered by ${model}. Your task: ${clean}.`,
    '',
    `Respond entirely in ${language}.`,
    '',
    'Follow these instructions:',
    '1. Ask any clarifying questions only if strictly necessary.',
    '2. Provide a structured, step-by-step response.',
    '3. Use clear, concise language and concrete examples.',
    '4. Highlight the most important insight at the end.',
    '',
    'Tone: professional, direct, and helpful.',
  ].join('\n')
}

export function PromptGenerator() {
  const [idea, setIdea] = useState('')
  const [language, setLanguage] = useState('English')
  const [model, setModel] = useState('GPT-4o')
  const [result, setResult] = useState<GeneratedPrompt | null>(null)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canGenerate = useMemo(() => idea.trim().length > 0, [idea])

  const handleGenerate = () => {
    if (!canGenerate) return
    setResult({
      input: idea.trim(),
      output: buildPrompt(idea, language, model),
      language,
      model,
    })
    setCopied(false)
  }

  const handleExample = (example: PromptExample) => {
    setIdea(example.seed)
    setResult({
      input: example.seed,
      output: buildPrompt(example.seed, language, model),
      language,
      model,
    })
    setCopied(false)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      handleGenerate()
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={5}
          placeholder="Describe what you want to achieve… e.g. write a cover letter for a marketing role"
          className="w-full resize-y rounded-2xl border border-border bg-card px-5 py-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground transition-colors duration-300 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
        <span className="pointer-events-none absolute bottom-3 right-4 hidden text-xs text-muted-foreground sm:block">
          ⌘ / Ctrl + Enter
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="group rounded-2xl border border-border bg-card px-4 py-3 transition-colors duration-300 focus-within:border-foreground">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Output language
          </span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
            aria-label="Output language"
          >
            {LANGUAGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="group rounded-2xl border border-border bg-card px-4 py-3 transition-colors duration-300 focus-within:border-foreground">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            AI model
          </span>
          <select
            value={model}
            onChange={(event) => setModel(event.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
            aria-label="AI model"
          >
            {MODELS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-foreground bg-foreground px-6 py-4 text-base font-medium text-background transition-colors duration-300 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Generate Prompt
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Try an example</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EXAMPLES.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => handleExample(example)}
              className="group flex flex-col items-start gap-1 rounded-2xl border border-border bg-card px-4 py-4 text-left transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-background">
                {example.label}
              </span>
              <span className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-background/70">
                {example.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Generated prompt</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.model} · {result.language}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
            {result.output}
          </pre>
        </div>
      )}
    </div>
  )
}
