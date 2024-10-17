import { ReactNode } from "react";

import { HomeContainer, LoginContainer } from "@/pages";

interface RouteValue {
	path: string;
	component: ReactNode;
	isPrivate: boolean;
}

export const routes: RouteValue[] = [
	{
		path: "/",
		component: <HomeContainer />,
		isPrivate: true,
	},
	{
		path: "login",
		component: <LoginContainer />,
		isPrivate: false,
	},
];
