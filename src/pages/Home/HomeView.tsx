import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { IBusinessData } from "@/lib/types/apiTypes";
import { useMappingsCtx } from "@/lib/stores/MappingsCtx";

import { Box, useToast } from "@chakra-ui/react";

import { MainForm } from "@/components/MainForm";

interface HomeViewProps {
	data: IBusinessData[];
}

export const HomeView: React.FC<HomeViewProps> = ({ data }) => {
	const mappings = useMappingsCtx();
	const queryClient = useQueryClient();
	const toast = useToast();
	// console.log("data", data);

	const deleteMutation = useMutation({
		mutationFn: (rowID: string) =>
			pb.collection(mappings.tableName).delete(rowID),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tableData"] });
			toast({
				title: "Entry deleted successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		},
		onError: (error) => {
			console.error(error);
			toast({
				title: "Error deleteing entry",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		},
	});

	const createRowMutation = useMutation({
		mutationFn: (data: Partial<IBusinessData>) =>
			pb.collection(mappings.tableName).create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tableData"] });
			toast({
				title: "Rând creat cu succes",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		},
		onError: (error) => {
			console.error(error);
			toast({
				title: "Eroare la crearea randului",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		},
	});

	const editMutation = useMutation({
		mutationFn: ({
			rowID,
			data,
		}: {
			rowID: string;
			data: Partial<IBusinessData>;
		}) => pb.collection(mappings.tableName).update(rowID, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tableData"] });
			toast({
				title: "Entry edited successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		},
		onError: (error) => {
			console.error(error);
			toast({
				title: "Error editing entry",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		},
	});

	return (
		<Box
			p={10}
			w={"100%"}
		>
			<MainForm
				createRowMutation={createRowMutation}
				deleteMutation={deleteMutation}
				editMutation={editMutation}
				formData={data}
			/>
		</Box>
	);
};
