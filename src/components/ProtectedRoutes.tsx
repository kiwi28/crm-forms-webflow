import { pb } from "@/lib/pocketbase";
import { MappingsProvider } from "@/lib/stores/MappingsCtx";
import { Navigate, Outlet } from "react-router-dom";

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
			<Outlet />
		</MappingsProvider>
	);
};
