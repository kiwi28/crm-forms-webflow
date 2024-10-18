import { pb } from "@/lib/pocketbase";
import { MappingsProvider } from "@/lib/stores/MappingsCtx";
import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Box } from "@chakra-ui/react";

export const ProtectedRoutes: React.FC = () => {
	// pb.authStore.clear();
	if (!pb.authStore.isValid) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return (
		<MappingsProvider>
			<NavBar />
			<Box mt={16}>
				<Outlet />
			</Box>
		</MappingsProvider>
	);
};
