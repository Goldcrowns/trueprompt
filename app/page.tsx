'use client'

import { PromptGenerator } from '@/components/prompt-generator'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
            T
          </span>
          <span className="text-base font-semibold tracking-tight">TruePrompt</span>
        </div>
        <ThemeToggle />
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-20 pt-8">
        <div className="mb-10 text-center">
          <p className="mb-4 inline-block rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Prompt Engineering, Simplified
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Ask the Right Question, Get the Best Answer.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            TruePrompt turns your rough idea into a precise, structured prompt — so every AI
            response comes back sharper, clearer, and more useful.
          </p>
        </div>

        <PromptGenerator />
      </section>

      <footer className="mx-auto w-full max-w-3xl px-6 py-8">
        <p className="text-center text-xs text-muted-foreground">
          {'\u00A9'} {new Date().getFullYear()} TruePrompt. Built for people who ask better
          questions.
        </p>
      </footer>
    </main>
  )
}
