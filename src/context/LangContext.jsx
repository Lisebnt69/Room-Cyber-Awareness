import { createContext, useContext, useState } from 'react'
import fr from '../i18n/fr'
import en from '../i18n/en'

const dicts = { fr, en }
const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('roomca_lang') || 'fr')

  const toggleLang = () => {
    const next = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    localStorage.setItem('roomca_lang', next)
  }

  const t = (key) => dicts[lang]?.[key] ?? dicts['fr']?.[key] ?? key

  return (
    <LangContext.Provider value={{ t, lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext)
