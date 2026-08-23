import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang, Theme } from '../types'

interface AppState {
  lang: Lang
  theme: Theme
  toggleLang: () => void
  toggleTheme: () => void
}

const AppContext = createContext<AppState | null>(null)

const TITLES: Record<Lang, string> = {
  en: 'Ibrahem Khaled | Senior Full Stack Developer',
  ar: 'إبراهيم خالد | مطور Full Stack أول',
}

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem('ik-lang')
    if (saved === 'ar' || saved === 'en') return saved
  } catch { /* ignore */ }
  return navigator.language.startsWith('ar') ? 'ar' : 'en'
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('ik-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* ignore */ }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = TITLES[lang]
    try { localStorage.setItem('ik-lang', lang) } catch { /* ignore */ }
  }, [lang])

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', theme === 'dark')
    html.classList.toggle('light', theme === 'light')
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#f6f6f1' : '#0a0a0c')
    try { localStorage.setItem('ik-theme', theme) } catch { /* ignore */ }
  }, [theme])

  const toggleLang = useCallback(() => setLang(l => (l === 'en' ? 'ar' : 'en')), [])
  const toggleTheme = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])

  return (
    <AppContext.Provider value={{ lang, theme, toggleLang, toggleTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
