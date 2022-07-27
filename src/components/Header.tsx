import {
  HStack,
  IconButton,
  Heading,
  useTheme,
  StyledProps,
} from "native-base";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps extends StyledProps {
  title: string;
}

export function Header({ title, ...rest }: HeaderProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <HStack
      w="full"
      alignItems="center"
      justifyContent="space-between"
      bg="gray.600"
      pb={6}
      pt={12}
      {...rest}
    >
      <IconButton
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
        onPress={handleGoBack}
      />

      <Heading
        flex={1}
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        ml={-6}
      >
        {title}
      </Heading>
    </HStack>
  );
}
