import * as SecureStore from 'expo-secure-store'

const OPEN_AI_API_KEY_STORE ='openai-api-key'
const USER_LOCALE_STORE = 'user-locale'
const MODEL_STORE = 'model'

export async function getOpenAiApiKey(): Promise<string> {
    return await SecureStore.getItemAsync(OPEN_AI_API_KEY_STORE) || ''
}

export async function setOpenAiApiKey(key: string): Promise<void> {
    return await SecureStore.setItemAsync(OPEN_AI_API_KEY_STORE, key)
}

export async function getUserLocale(): Promise<string> {
    return await SecureStore.getItemAsync(USER_LOCALE_STORE) || ''
}

export async function setUserLocale(locale: string): Promise<void> {
    return await SecureStore.setItemAsync(USER_LOCALE_STORE, locale)
}

export async function getUserModel(): Promise<string> {
    return await SecureStore.getItemAsync(MODEL_STORE) || ''
}

export async function setUserModel(model: string): Promise<void> {
    return await SecureStore.setItemAsync(MODEL_STORE, model)
}

export async function clearAll(): Promise<void> {
    await SecureStore.deleteItemAsync(OPEN_AI_API_KEY_STORE)
    await SecureStore.deleteItemAsync(USER_LOCALE_STORE)
    await SecureStore.deleteItemAsync(MODEL_STORE)
}