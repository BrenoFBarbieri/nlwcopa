import { Icon, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Pools() {
	const { navigate } = useNavigation();

	return (
		<VStack flex={1} bg="gray.900">
			<Header title="Meus bolões" />

			<VStack
				mt={6}
				mx={5}
				borderBottomWidth={1}
				borderBottomColor="gray.600"
				pb={4}
				mb={4}
			>
				<Button
					title="Buscar bolão por código"
					leftIcon={
						<Icon
							as={Octicons}
							name="search"
							color="black"
							size="md"
						/>
					}
					onPress={() => navigate("find")}
				/>
			</VStack>
		</VStack>
	);
}
