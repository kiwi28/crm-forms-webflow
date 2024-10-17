import { Alert, AlertIcon, AlertTitle, Center } from "@chakra-ui/react";

export const BigError: React.FC<{ message: string }> = ({ message }) => {
	return (
		<Center>
			<Alert status="error">
				<AlertIcon />
				<AlertTitle>{message}</AlertTitle>
			</Alert>
		</Center>
	);
};
