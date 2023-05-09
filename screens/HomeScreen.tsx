import {useContext, useEffect, useState} from "react";
import Voice, {SpeechErrorEvent, SpeechResultsEvent} from "@react-native-voice/voice";
import {getOpenAiResponse} from "../util/OpenAiApi";
import * as Speech from "expo-speech";
import {Button, ScrollView, Text, VStack} from "native-base";
import * as React from "react";
import {SettingsContext} from "../components/SettingsContext";
import {showMessage} from "react-native-flash-message";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../config/Colors";
import {ActivityIndicator} from "react-native";

export function HomeScreen() {
    const [isRecording, setIsRecording] = useState(false);
    const [prompt, setPrompt] = useState("")
    const [gptAnswer, setGptAnswer] = useState("")
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { apiKey, locale, model } = useContext(SettingsContext)

    const colorScheme = useColorScheme()
    const bgColor = Colors[colorScheme].cardColor

    const recordEnabled = () => model !== "" && apiKey !== "" && locale !== ""

    // initialise voice
    useEffect(() => {
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, [apiKey, model, locale])

    // trigger OpenAI call when prompt changes and is not empty, but only if not recording
    // then speak and display the response

    useEffect(() => {

        if(!isRecording && prompt != "") {
            const asyncFunc = async () => {
                setIsLoading(true)
                const response = await getOpenAiResponse(apiKey, model, prompt)
                setIsLoading(false)

                if (!response.isError) {
                    Speech.speak(response.text,
                        {
                            onStart: () => setIsSpeaking(true),
                            onDone: () => setIsSpeaking(false),
                            onError: () => setIsSpeaking(false),
                            onStopped: () => setIsSpeaking(false)
                        }
                    )
                } else {
                    showMessage({
                        message: response.text,
                        description: `${response.errorMessage}`,
                        type: 'danger',
                        floating: true,
                    })
                }
                setGptAnswer(response.text)
            }

            asyncFunc().catch((e) => {
                showMessage({
                    message: "Unexpected Error",
                    description: `${e}`,
                    type: 'danger',
                    floating: true,
                })
            })
        }
    },[prompt, isRecording])

    const startSpeechToText = async () => {
        setPrompt("")
        setGptAnswer("")
        await Voice.start(locale)
        setIsRecording(true)
    }

    const stopSpeechToText = async () => {
        await Voice.stop()
        setIsRecording(false)
    }

    const onSpeechResults = async (result: SpeechResultsEvent) => {
        const results = result.value

        if(results && results.length > 0) {
            const inputText = results[0]
            setPrompt(inputText)
        }
    }

    const onSpeechError = (error: SpeechErrorEvent) => {
        showMessage({
            message: "Speech Error",
            description: `${error.error?.message}`,
            type: "danger",
            floating: true,
        })
    }

    interface ButtonInfo {
        text: string
        action: () => Promise<void>
    }

    const buttonInfo: ButtonInfo = isRecording ?
        {
            text: "Stop Recording",
            action: stopSpeechToText
        } :
        {
            text: "Start Recording",
            action: startSpeechToText
        }

    return (
        <VStack height="100%">
            <Button
                margin={3}
                onPress={buttonInfo.action}
                isDisabled={!recordEnabled()}
            >
                <Text color="white" fontSize="lg">{buttonInfo.text}</Text>
            </Button>

            <Button
                margin={3}
                onPress={() => Speech.stop()}
                isDisabled={!isSpeaking}
            >
                <Text color="white" fontSize="lg">Stop Speaking</Text>
            </Button>

            { !recordEnabled() &&
                <Text fontSize="lg" alignSelf="center">Please visit the settings screen to get started</Text>
            }

            <ScrollView>
                <VStack margin={2} borderRadius="md" bgColor={bgColor}>
                    <Text fontSize="md" bold>Question</Text>
                    <Text margin={1}>{prompt}</Text>
                </VStack>
                <VStack margin={2} borderRadius="md" bgColor={bgColor}>
                    <Text fontSize="md" bold>Answer</Text>
                    <Text margin={1}>{gptAnswer}</Text>
                </VStack>
            </ScrollView>

            { isLoading &&
                <ActivityIndicator
                    size="large"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ scaleX: 2 }, { scaleY: 2 }]
                    }}
                />
            }
        </VStack>
    )
}
