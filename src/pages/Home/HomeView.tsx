import { MainForm } from "@/components/MainForm";
import { pb } from "@/lib/pocketbase";
import { useMappingsCtx } from "@/lib/stores/MappingsCtx";
import { IBusinessData } from "@/lib/types/apiTypes";
import { Box, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
		<Box p={10}>
			<MainForm
				deleteMutation={deleteMutation}
				editMutation={editMutation}
				formData={data}
			/>
		</Box>
	);
};
