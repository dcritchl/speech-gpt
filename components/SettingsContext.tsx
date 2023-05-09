import {createContext, PropsWithChildren, useMemo, useState} from "react";

interface SettingsContextInterface{
    model: string
    setModel: (u: string) => void
    locale: string
    setLocale: (u: string) => void
    apiKey: string
    setApiKey: (u: string) => void
}

const SettingsContext = createContext<SettingsContextInterface>({
    model: "",
    setModel: (u: string) => {},
    locale: "",
    setLocale: (u: string) => {},
    apiKey: "",
    setApiKey: (u: string) => {}
})

const SettingsContextProvider = ({ children }: PropsWithChildren<{}>) => {
    const [model, setModel] = useState<string>('')
    const [locale, setLocale] = useState<string>('')
    const [apiKey, setApiKey] = useState<string>('')

    const contextValue = useMemo(() => {
        return {
            model,
            setModel,
            locale,
            setLocale,
            apiKey,
            setApiKey
        }
    }, [model, locale, apiKey])

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    )
}

export { SettingsContext, SettingsContextProvider }