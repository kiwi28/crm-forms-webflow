import { Box, Heading, Link } from "@chakra-ui/react";

export const NotFound: React.FC = () => {
	return (
		<Box>
			<Heading as={"h2"}>404: Page not found</Heading>
			<Link href={"/"}>Go Home</Link>
		</Box>
	);
};
