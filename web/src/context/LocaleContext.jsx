import { createContext, useContext, useState } from 'react'
import enUS from '../locales/en-US'
import fiFI from '../locales/fi-FI'

const LOCALES = { 'en-US': enUS, 'fi-FI': fiFI }

export const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => localStorage.getItem('locale') || 'en-US')

  const setLocale = (code) => {
    setLocaleState(code)
    localStorage.setItem('locale', code)
  }

  return (
    <LocaleContext.Provider value={{ t: LOCALES[locale], locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
