import { Flex } from "@chakra-ui/react";

interface PageLayoutProps {
	children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
	return (
		<Flex
			h={"100vh"}
			w={"100vw"}
			direction={"column"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			{children}
		</Flex>
	);
};
