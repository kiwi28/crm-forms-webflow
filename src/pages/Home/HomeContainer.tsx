import { pb } from "@/lib/pocketbase";
import { useQuery } from "@tanstack/react-query";

import { useMappingsCtx } from "@/lib/stores/MappingsCtx";

import { HomeView } from "./HomeView";
import { LoadingPage } from "@/components/LoadingPage";
import { BigError } from "@/components/BigError";
import { IBusinessData } from "@/lib/types/apiTypes";

export const HomeContainer = () => {
	// const [tableData, setTableData] = useState<IBusinessData[]>([]);

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

	if (dataQuery.isLoading) {
		return <LoadingPage />;
	}

	if (dataQuery.isError) {
		return <BigError message={dataQuery.error.message} />;
	}

	if (!dataQuery.data) {
		return <BigError message="No data found" />;
	}

	return <HomeView data={dataQuery.data} />;
};

// as Promise<IPbRespMulti<IBusinessData>>
