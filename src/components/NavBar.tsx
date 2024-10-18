import { pb } from "@/lib/pocketbase";
import { useMappingsCtx } from "@/lib/stores/MappingsCtx";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const NavBar: React.FC = () => {
	const { tableName } = useMappingsCtx();
	const navigate = useNavigate();

	const handleSignOut = useCallback(() => {
		pb.authStore.clear();
		navigate("/login");
	}, [pb.authStore]);

	return (
		<Box
			w={"100vw"}
			h={16}
			position={"fixed"}
			bg={"white"}
		>
			<SimpleGrid
				w={"100%"}
				h={"100%"}
				columns={3}
			>
				<Flex alignItems={"center"}>
					<Image
						src={"./logo.svg"}
						alt={"logo"}
						h={12}
						ml={4}
					/>
				</Flex>
				<Flex
					justifyContent={"center"}
					alignItems={"center"}
				>
					{tableName}
				</Flex>
				<Flex
					alignItems={"center"}
					justifyContent={"flex-end"}
					mr={4}
				>
					<Button
						leftIcon={<ArrowBackIcon />}
						onClick={handleSignOut}
					>
						Sign out
					</Button>
				</Flex>
			</SimpleGrid>
		</Box>
	);
};
