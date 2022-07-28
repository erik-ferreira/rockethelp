import React, { useState } from "react";
import { Alert } from "react-native";
import { VStack, Heading, Icon, useTheme, ScrollView } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import auth from "@react-native-firebase/auth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import Logo from "../assets/logo_primary.svg";

function Signin() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Informe email e a senha!");
    }

    try {
      setIsLoading(true);

      await auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      setIsLoading(false);

      console.log("error", err);

      if (err.code === "auth/invalid-email") {
        return Alert.alert("Entrar", "E-mail inválido.");
      }

      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        return Alert.alert("Entrar", "E-mail ou senha inválida.");
      }

      return Alert.alert("Entrar", "Não foi possível acessar");
    }
  }

  return (
    <ScrollView bg="gray.600">
      <VStack flex={1} alignItems="center" px={8} pt={24} pb={18}>
        <Logo />

        <Heading color="gray.100" mt={20} mb={6}>
          Acesse sua conta
        </Heading>

        <Input
          mb={4}
          placeholder="E-mail"
          InputLeftElement={
            <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
          }
          value={email}
          onChangeText={setEmail}
        />
        <Input
          mb={8}
          placeholder="Senha"
          InputLeftElement={
            <Icon as={<Key color={colors.gray[300]} />} ml={4} />
          }
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title="Entrar"
          w="full"
          isLoading={isLoading}
          onPress={handleSignIn}
        />
      </VStack>
    </ScrollView>
  );
}

export { Signin };
