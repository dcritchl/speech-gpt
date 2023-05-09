# Speech-GPT

## Introduction
This is an Expo/react-native demo mobile app that does the following:
* uses react-native-voice to capture a question from spoken text
* uses an OpenAI API chat model to retrieve a response to the question
* use the expo-speech API to generate speech from the response

The Q&A is also shown on the screen in text form.

N.B. an OpenAI account and corresponding API key are required to run the app.

## Build Assumptions
* the Expo cli tool is installed
* the Expo EAS cli tool is installed
* the Expo Go app is installed on the mobile device

## Building the dev client
Because the app has native dependencies, it is necessary to build the app using the Expo build service. 
This is done using the `eas` CLI tool. The following command is used to build the app locally:

`eas build -p android --profile development --local`

The `--local` flag is used to build the app locally rather than using the EAS build service. This is useful for debugging.

On Android, an APK is produced with a name like `build-1683026313164.apk`

## Installing the dev client
On Android, the resulting APK can be installed to a connected device using ADB e.g.

`adb install -r build-1683026313164.apk`

## Running the dev client
On the development machine, run the following command:

`npx expo start --dev-client`

On the mobile device, run the Expo Go app and select the project from the list of development servers.

## Building the preview or production client
The following command is used to build the app using the EAS build service:

for preview:
`eas build -p android --profile preview --local`

for production:
`eas build -p android --profile production --local`

The resulting APK can be installed to a connected device using ADB as per above.

## Acknowledgements
Thanks to @chelseafarley for providing a helpful introduction to `react-native-voice` :
see the [video tutorial](https://www.youtube.com/watch?v=gpXF9heaw8k&ab_channel=MissCoding) and 
[repo](https://github.com/chelseafarley/expo-speech-to-text)

## TODO
The build procedure on iOS is a little more involved. This needs to be documented.

The current state of testing for iOS in a simulator is that speech recognition and OpenAI calls work correctly, 
but speech synthesis does not. This appears to be a simulator issue. The synthesis works correctly on a physical device.