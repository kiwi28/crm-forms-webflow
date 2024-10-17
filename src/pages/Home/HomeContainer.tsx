import { useEffect, useState } from "react";

import { pb } from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";

import { useMappingsCtx } from "@/lib/stores/MappingsCtx";

import { HomeView } from "./HomeView";
import { LoadingPage } from "@/components/LoadingPage";
import { BigError } from "@/components/BigError";
import { IBusinessData } from "@/lib/types/apiTypes";
import { formatDateForRomania } from "@/lib/utils";

export const HomeContainer = () => {
	const [tableData, setTableData] = useState<IBusinessData[]>([]);

	// const [sortOptinos]

	const { tableName } = useMappingsCtx();
	const dataQuery = useQuery({
		queryKey: ["tableData"],
		queryFn: () =>
			pb.collection(tableName).getFullList<IBusinessData>({
				sort: "-created",
			}),
		enabled: !!tableName,
	});

	useEffect(() => {
		if (dataQuery.data) {
			setTableData([
				...dataQuery.data.map((item) => {
					const formattedDate = formatDateForRomania(item.appointment);
					return { ...item, appointment: formattedDate };
				}),
			]);
		}
	}, [dataQuery.data]);

	if (dataQuery.isFetching) {
		return <LoadingPage />;
	}

	if (dataQuery.isError) {
		return <BigError message={dataQuery.error.message} />;
	}

	if (!dataQuery.data || tableData.length === 0) {
		return <BigError message="No data found" />;
	}

	return <HomeView data={tableData} />;
};

// as Promise<IPbRespMulti<IBusinessData>>
