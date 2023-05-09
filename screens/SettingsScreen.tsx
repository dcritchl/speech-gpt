import {useContext, useState} from "react";
import {ChatCompletionModels} from "../config/ChatCompletionModels";
import {
    setOpenAiApiKey,
    setUserLocale,
    setUserModel
} from "../util/SettingsUtil";
import {getLocales} from "expo-localization";
import {Button, HStack, Input, Popover, Text, VStack} from "native-base";
import {Configuration, Model, OpenAIApi} from "openai";
import {showMessage} from "react-native-flash-message";
import {FlatList} from "react-native";
import * as React from "react";
import {SettingsContext} from "../components/SettingsContext";

export function SettingsScreen() {
    const [changed, setChanged] = useState(false)
    const {apiKey, setApiKey, locale, setLocale, model, setModel} = useContext(SettingsContext)
    const [localePopoverOpen, setLocalePopoverOpen] = useState(false)
    const [modelPopoverOpen, setModelPopoverOpen] = useState(false)

    const [availableModels, setAvailableModels] = useState<string[]>([])
    const compatibleModelsSet = new Set(ChatCompletionModels)

    const locales = getLocales().map((locale) => locale.languageTag)

    return (
        <VStack margin={2}>
            <HStack alignItems="center">
                <Text fontSize="lg" bold width="1/5">API Key</Text>
                <Input
                    flex={1}
                    value={apiKey}
                    onChangeText={(text) => {
                        setApiKey(text.trim())
                        setChanged(true)
                    }}
                    placeholder="enter key"
                    fontSize="md"
                />
            </HStack>
            { apiKey !== "" &&
                <HStack alignItems="center" marginTop={1}>
                    <Text fontSize="lg" bold width="1/5"></Text>
                    <Button
                        onPress={
                            async () => {
                                try {
                                    const configuration = new Configuration({
                                        apiKey: apiKey,
                                    })
                                    const openai = new OpenAIApi(configuration)
                                    const models: Model[] = (await openai.listModels()).data.data

                                    setAvailableModels(models.filter((model) => {
                                        return compatibleModelsSet.has(model.id)
                                    }).map((model) => model.id))

                                    showMessage({
                                        message: "Valid API Key",
                                        type: "success",
                                        floating: true,
                                    })
                                } catch (e) {
                                    showMessage({
                                        message: "Invalid API Key",
                                        description: `${e}`,
                                        type: "danger",
                                        floating: true,
                                    })
                                }
                            }}
                    >
                        TEST KEY AND GET MODELS
                    </Button>
                </HStack>
            }
            {
                availableModels.length > 0 ?
                    <HStack alignItems="center" marginTop={2}>
                        <Text fontSize="lg" bold width="1/5">Model</Text>
                        <Popover trigger={(triggerProps) => {
                            return (
                                <Button
                                    {...triggerProps}
                                    width="100%"
                                    onPress={() => {
                                        setModelPopoverOpen(!modelPopoverOpen)
                                    }}
                                >
                                    <Text fontSize="lg" color="white">{model == '' ? 'CHOOSE MODEL' : model}</Text>
                                </Button>
                            )
                        }}
                                 isOpen={modelPopoverOpen}
                        >
                            <Popover.Content width="xs">
                                <Popover.Arrow />
                                <Popover.CloseButton
                                    onPress={() => {
                                        setModelPopoverOpen(false)
                                    }}
                                />
                                <Popover.Header>Select Model</Popover.Header>
                                <Popover.Body>
                                    <FlatList
                                        data={availableModels}
                                        renderItem={({item}) =>
                                            <Button
                                                margin={1}
                                                onPress={() => {
                                                    if(item !== model) {
                                                        setModel(item)
                                                        setChanged(true)
                                                    }
                                                    setModelPopoverOpen(false)
                                                }}
                                            >
                                                {item}
                                            </Button>}
                                    />
                                </Popover.Body>
                            </Popover.Content>
                        </Popover>
                    </HStack> :
                    <HStack alignItems="center" marginTop={2}>
                        <Text fontSize="lg" bold width="1/5">Model</Text>
                        <Text fontSize="lg">{model}</Text>
                    </HStack>
            }
            <HStack alignItems="center" marginTop={2}>
                <Text fontSize="lg" bold width="1/5">Locale</Text>
                <Popover trigger={(triggerProps) => {
                    return (
                        <Button
                            {...triggerProps}
                            width="100%"
                            onPress={() => {
                                setLocalePopoverOpen(!localePopoverOpen)
                            }}
                        >
                            <Text fontSize="lg" color="white">{locale == '' ? 'CHOOSE LOCALE' : locale}</Text>
                        </Button>
                    )
                }}
                         isOpen={localePopoverOpen}
                >
                    <Popover.Content width="xs">
                        <Popover.Arrow />
                        <Popover.CloseButton
                            onPress={() => {
                                setLocalePopoverOpen(false)
                            }}
                        />
                        <Popover.Header>Select Locale</Popover.Header>
                        <Popover.Body>
                            <FlatList
                                data={locales}
                                renderItem={({item}) =>
                                    <Button
                                        margin={1}
                                        onPress={() => {
                                            if(item !== locale) {
                                                setLocale(item)
                                                setChanged(true)
                                            }
                                            setLocalePopoverOpen(false)
                                        }}
                                    >
                                        {item}
                                    </Button>}
                            />
                        </Popover.Body>
                    </Popover.Content>
                </Popover>
            </HStack>
            <Button
                margin={2}
                isDisabled={apiKey === "" || !changed}
                onPress={async () => {
                    await setOpenAiApiKey(apiKey)
                    await setUserLocale(locale)
                    await setUserModel(model)
                    setChanged(false)
                    showMessage({
                        message: "Settings Saved",
                        type: "success",
                        floating: true,
                    })
                }}
            >
                SAVE SETTINGS
            </Button>
        </VStack>
    )
}