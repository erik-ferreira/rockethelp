import { useState } from "react";
import { Alert } from "react-native";
import { VStack } from "native-base";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

export function Register() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");

  async function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert("Registrar", "Preencha todos os campos.");
    }

    try {
      setLoading(true);

      await firestore().collection("orders").add({
        patrimony,
        description,
        status: "open",
        created_at: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Solicitações", "Solicitação registrada com sucesso.");
      navigation.goBack();
    } catch (err) {
      console.log(err);

      setLoading(false);
      return Alert.alert("Solicitação", "Não foi possível registrar o pedido.");
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />

      <Input
        placeholder="Número do patrimônio"
        mt={4}
        value={patrimony}
        onChangeText={setPatrimony}
      />
      <Input
        flex={1}
        placeholder="Descrição do problema"
        mt={5}
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={loading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}
