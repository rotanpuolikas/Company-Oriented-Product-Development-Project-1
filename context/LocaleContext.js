import { createContext, useContext, useState, useEffect } from 'react'
import { Platform } from 'react-native'
import enUS from '../languages/en-US'
import fiFI from '../languages/fi-FI'

const storage = Platform.OS === 'web'
  ? {
      getItem: (key) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    }
  : require('@react-native-async-storage/async-storage').default

const LOCALES = { 'en-US': enUS, 'fi-FI': fiFI }

export const LocaleContext = createContext()

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('en-US')

  useEffect(() => {
    storage.getItem('locale').then((saved) => {
      if (saved && LOCALES[saved]) setLocaleState(saved)
    })
  }, [])

  const setLocale = async (code) => {
    setLocaleState(code)
    await storage.setItem('locale', code)
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
