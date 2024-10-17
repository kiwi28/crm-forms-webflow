import { createContext, useContext, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { IMappingsResp } from "../types/apiTypes";
import { pb } from "../pocketbase";
import { BigError } from "@/components/BigError";
import { LoadingPage } from "@/components/LoadingPage";

const initialValues: IMappingsResp = {
	id: "",
	tableName: "",
	map: {},
	userEmail: "",
	created: "",
	updated: "",
	collectionId: "",
	collectionName: "",
};

const MappingsContext = createContext<IMappingsResp>(initialValues);
MappingsContext.displayName = "MappingsContext";

export const useMappingsCtx = () => {
	const context = useContext(MappingsContext);
	if (context === undefined) {
		throw new Error("useMappingsCtx must be used within a MappingsProvider");
	}
	return context;
};

interface MappingsProviderProps {
	children: React.ReactNode;
}

export const MappingsProvider: React.FC<MappingsProviderProps> = ({
	children,
}) => {
	const [mappings, setMappings] = useState<IMappingsResp>(initialValues);

	const getMappingsQuery = useQuery({
		queryKey: ["mappings"],
		queryFn: () =>
			pb
				.collection("mappings")
				.getFirstListItem<IMappingsResp>(
					`userEmail="${pb.authStore.model?.email}"`
				),
		enabled: !!pb.authStore.isValid && !!pb.authStore.model?.email,
	});

	useEffect(() => {
		if (getMappingsQuery.data) {
			const userMap = getMappingsQuery.data;
			setMappings(userMap);
		}
	}, [getMappingsQuery.data]);

	if (getMappingsQuery.isLoading) {
		return <LoadingPage />;
	}

	if (getMappingsQuery.isError) {
		console.error(getMappingsQuery.error);
		return (
			<BigError message={"Something went wrong when getting the user map"} />
		);
	}

	return (
		<MappingsContext.Provider value={mappings}>
			{children}
		</MappingsContext.Provider>
	);
};
