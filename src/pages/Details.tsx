import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { VStack, Text, HStack, useTheme, ScrollView, Box } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
} from "phosphor-react-native";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { OrderProps } from "../components/Order";
import { CardDetails } from "../components/CardDetails";

import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";

import { dateFormat } from "../utils/firestoredDateFormat";
import { Input } from "../components/Input";

interface RouteParams {
  orderId: string;
}

interface OrderDetails extends OrderProps {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const route = useRoute();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams;

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [isLoadingDetailOrder, setIsLoadingDetailOrder] = useState(true);
  const [solution, setSolution] = useState("");

  async function loadDetailsOrder() {
    try {
      const doc = await firestore()
        .collection<OrderFirestoreDTO>("orders")
        .doc(orderId)
        .get();

      const {
        patrimony,
        description,
        status,
        created_at,
        closed_at,
        solution,
      } = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingDetailOrder(false);
    }
  }

  function handleOrderClosed() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação"
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada.");
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
      });
  }

  useEffect(() => {
    loadDetailsOrder();
  }, []);

  if (isLoadingDetailOrder) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />
        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={Clipboard}
        />
        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              value={solution}
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button
          title="Encerrar solicitação"
          margin={5}
          onPress={handleOrderClosed}
        />
      )}
    </VStack>
  );
}
