import React from "react";
import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { Signin } from "./src/pages/Signin";
import { Loading } from "./src/components/Loading";

import { THEME } from "./src/styles/theme";

export default function App() {
  const [fonstLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {!fonstLoaded ? <Loading /> : <Signin />}
    </NativeBaseProvider>
  );
}