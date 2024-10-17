import { Flex, Spinner } from "@chakra-ui/react";

export const LoadingPage: React.FC = () => {
	return (
		<Flex
			alignItems={"center"}
			justifyContent={"center"}
			w={"100vw"}
			h={"100vh"}
		>
			<Spinner />
		</Flex>
	);
};
