import * as React from 'react';
import 'react-native-url-polyfill/auto'
import { NavigationContainer, DarkTheme, DefaultTheme, useNavigation, ParamListBase } from '@react-navigation/native';
import {createDrawerNavigator, DrawerNavigationProp} from '@react-navigation/drawer';
import {extendTheme, Icon, NativeBaseProvider, VStack} from 'native-base';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {HomeScreen} from "./screens/HomeScreen";
import {SettingsScreen} from "./screens/SettingsScreen";
import {SettingsContext, SettingsContextProvider} from "./components/SettingsContext";
import useColorScheme from "./hooks/useColorScheme";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import Colors from "./config/Colors";
import {useContext, useEffect} from "react";
import {clearAll, getOpenAiApiKey, getUserLocale, getUserModel} from "./util/SettingsUtil";

const Drawer = createDrawerNavigator()

interface CustomDrawerToggleButtonProps {
    tintColor: string
}

function CustomDrawerToggleButton({ tintColor }: CustomDrawerToggleButtonProps) {
    const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>()

    return (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <VStack margin={3}>
                <Icon color={tintColor} as={<FontAwesome name="navicon"/>} size={6} />
            </VStack>
        </TouchableOpacity>
    )
}

function AppNavigation() {
    const colorScheme = useColorScheme()
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

    const { setApiKey, setLocale, setModel } = useContext(SettingsContext)

    // load settings from secure storage
    // if unable to load, reset settings

    useEffect(() => {
        const updateFunction = async () => {
            try {
                setApiKey(await getOpenAiApiKey())
                setModel(await getUserModel())
                setLocale(await getUserLocale())
            } catch (e) {
                showMessage({
                    message: "Unable to load settings, resetting",
                    description: `${e}`,
                    type: "danger",
                    floating: true,
                    duration: 3000
                })
                await clearAll()
                setModel("")
                setLocale("")
                setApiKey("")
            }
        }
        updateFunction().catch((e) => {
            showMessage({
                message: "Unable to reset settings",
                description: `${e}`,
                type: "danger",
                floating: true,
            })
        })
    }, [])

    return (
        <NavigationContainer theme={theme}>
            <Drawer.Navigator
                screenOptions={{
                    headerLeft: () => <CustomDrawerToggleButton tintColor={Colors[colorScheme].tint} />,
                }}>
                <Drawer.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        drawerIcon: ({ color }) => <Icon color={color} as={<MaterialIcons name="home" />} size={10} />
                    }}
                />
                <Drawer.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        drawerIcon: ({ color }) => <Icon color={color} as={<MaterialIcons name="settings" />} size={10} />
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

function App() {
    const config = {
        useSystemColorMode: true
    }

    const customTheme = extendTheme({ config })

    return (
        <NativeBaseProvider theme={customTheme}>
            <SettingsContextProvider>
                <AppNavigation />
                <FlashMessage position="top" />
            </SettingsContextProvider>
        </NativeBaseProvider>
    )
}

export default App;
