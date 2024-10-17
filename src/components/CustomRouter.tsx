import { Route, Routes } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { NotFound } from "@/pages";
import { routes } from "@/lib/routes";

export const CustomRouter = () => {
	return (
		<Routes>
			{routes &&
				routes.map((route) =>
					route.isPrivate ? (
						<Route
							key={route.path}
							element={<ProtectedRoutes />}
						>
							<Route
								path={route.path}
								element={route.component}
							/>
						</Route>
					) : (
						<Route
							key={route.path}
							path={route.path}
							element={route.component}
						/>
					)
				)}
			<Route
				path="/*"
				element={<NotFound />}
			/>
		</Routes>
	);
};
