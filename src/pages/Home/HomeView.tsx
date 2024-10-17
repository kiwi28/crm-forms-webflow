import React from "react";

import { IBusinessData } from "@/lib/types/apiTypes";
import { useMappingsCtx } from "@/lib/stores/MappingsCtx";
import {
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";

interface HomeViewProps {
	data: IBusinessData[];
}

export const HomeView: React.FC<HomeViewProps> = ({ data }) => {
	const mappings = useMappingsCtx();
	console.log("data", data);

	return (
		<TableContainer>
			<Table variant={"striped"}>
				<Thead>
					<Tr>
						{Object.values(mappings.map).map((headerItem, idx) => (
							<Th key={idx}>{headerItem.header}</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{data.map((row) => (
						<Tr key={row.id}>
							{Object.keys(mappings.map).map((cellKey, idx) => (
								<Td
									key={idx}
									maxW={
										mappings.map[cellKey].size
											? mappings.map[cellKey].size
											: undefined
									}
									wordBreak={"break-word"}
									// wordWrap={"break-word"}
									whiteSpace={"normal"}
									// maxW={10}
								>
									{row[cellKey as keyof typeof row]}
								</Td>
							))}
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
};
