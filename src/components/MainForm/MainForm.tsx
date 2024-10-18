import { useMappingsCtx } from "@/lib/stores/MappingsCtx";
import { IBusinessData } from "@/lib/types/apiTypes";
import { formatDateForRomania } from "@/lib/utils";
import {
	Button,
	FormLabel,
	HamburgerIcon,
	HStack,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Switch,
	Table,
	TableContainer,
	Tbody,
	Td,
	Textarea,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from "@chakra-ui/icons";
import { UseMutationResult } from "@tanstack/react-query";
import { RecordModel } from "pocketbase";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type MainFormProps = {
	formData: IBusinessData[];
	deleteMutation: UseMutationResult<boolean, Error, string, unknown>;
	editMutation: UseMutationResult<
		RecordModel,
		Error,
		{
			rowID: string;
			data: Partial<IBusinessData>;
		},
		unknown
	>;
};

export const MainForm: React.FC<MainFormProps> = ({
	formData,
	editMutation,
	deleteMutation,
}) => {
	const [isTableExpanded, setIsTableExpanded] = useState(false);

	const mappings = useMappingsCtx();

	const handleTableExpand = useCallback(() => {
		setIsTableExpanded(!isTableExpanded);
	}, [setIsTableExpanded, isTableExpanded]);

	return (
		<>
			<HStack mb={2}>
				<FormLabel
					m={0}
					htmlFor="expand-table"
				>
					Expand table
				</FormLabel>
				<Switch
					disabled
					id="expand-table"
					isChecked={isTableExpanded}
					onChange={handleTableExpand}
				/>
			</HStack>
			<TableContainer>
				<Table
					variant={"striped"}
					w={"100%"}
					// layout={"fixed"}
				>
					<Thead>
						<Tr>
							<Th></Th>
							<Th
								p={1}
								textAlign={"center"}
							>
								Creat
							</Th>
							{Object.values(mappings.map).map((headerItem, idx) => (
								<Th
									key={idx}
									p={1}
									textAlign={"center"}
									// display={
									// 	headerItem.dynamicWidth ? "inline-block" : "table-cell"
									// }
								>
									{headerItem.header}
								</Th>
							))}
						</Tr>
					</Thead>
					<Tbody>
						{formData.map((row) => (
							<DataRow
								key={row.id}
								row={row}
								handleDelete={() => deleteMutation.mutate(row.id)}
								editMutation={editMutation}
							/>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
};

const DataRow: React.FC<{
	row: IBusinessData;
	handleDelete: (value: string) => void;
	editMutation: UseMutationResult<
		RecordModel,
		Error,
		{
			rowID: string;
			data: Partial<IBusinessData>;
		},
		unknown
	>;
}> = ({ row, handleDelete, editMutation }) => {
	const {
		isOpen: isOpenClose,
		onOpen: onOpenClose,
		onClose: onCloseClose,
	} = useDisclosure();
	const editDisclosure = useDisclosure();

	const mappings = useMappingsCtx();

	return (
		<Tr key={row.id}>
			<Td
				border={"1px solid"}
				borderColor={"gray.100"}
				p={1}
				textAlign={"center"}
				cursor={"pointer"}
			>
				<span>
					<Menu>
						<MenuButton
							as={IconButton}
							icon={<HamburgerIcon h={4} />}
							variant={"ghost"}
						/>
						<MenuList>
							<MenuItem onClick={editDisclosure.onOpen}>Edit</MenuItem>
							<MenuItem onClick={onOpenClose}>Delete</MenuItem>
						</MenuList>
					</Menu>
					<ModalEdit
						editDisclosure={editDisclosure}
						rowData={row}
						editMutation={editMutation}
					/>
					<Modal
						isOpen={isOpenClose}
						onClose={onCloseClose}
					>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Confirma stergerea randului</ModalHeader>
							<ModalCloseButton />

							<ModalFooter>
								<Button
									variant={"ghost"}
									mr={3}
									onClick={onCloseClose}
								>
									Anuleaza
								</Button>
								<Button
									onClick={() => handleDelete(row.id)}
									colorScheme="red"
								>
									Sterge
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</span>
			</Td>
			<Td
				border={"1px solid"}
				borderColor={"gray.100"}
				p={1}
				textAlign={"center"}
				// wordBreak={"break-word"}
				// whiteSpace={"normal"}
				// w={24}
			>
				{formatDateForRomania(row.created)}
			</Td>
			{Object.keys(mappings.map).map((cellKey, idx) => (
				<Td
					key={idx}
					border={"1px solid"}
					borderColor={"gray.100"}
					p={1}
					w={
						mappings?.map?.[cellKey]?.size
							? `${mappings?.map?.[cellKey]?.size}px`
							: undefined
					}
					minW={10}
					textAlign={"center"}
					overflow={"hidden"}
					whiteSpace={"normal"}
				>
					{row[cellKey as keyof typeof row]}
				</Td>
			))}
		</Tr>
	);
};

type ModalEditProps = {
	editDisclosure: ReturnType<typeof useDisclosure>;
	rowData: IBusinessData;
	editMutation: UseMutationResult<
		RecordModel,
		Error,
		{
			rowID: string;
			data: Partial<IBusinessData>;
		},
		unknown
	>;
};

const ModalEdit: React.FC<ModalEditProps> = ({
	editDisclosure,
	rowData,
	editMutation,
}) => {
	const { isOpen, onClose } = editDisclosure;
	const mappings = useMappingsCtx();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<Partial<IBusinessData>>({
		defaultValues: rowData,
	});

	const onSubmit: SubmitHandler<Partial<IBusinessData>> = (data) => {
		console.log("submit data", data);
		editMutation.mutate({ rowID: rowData.id, data });
	};
	console.log("row errors", errors);

	useEffect(() => {
		onClose();
	}, [editMutation.isSuccess]);
	return (
		<Modal
			size={"xl"}
			isOpen={isOpen}
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Editează rândul</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{Object.keys(mappings.map).map((cellKey, idx) => (
							<FormLabel key={idx}>
								{mappings.map[cellKey].header}
								{mappings.map[cellKey].dynamicWidth ? (
									<Textarea {...register(cellKey)} />
								) : (
									<Input {...register(cellKey)} />
								)}
							</FormLabel>
						))}
					</ModalBody>

					<ModalFooter>
						<Button
							variant={"ghost"}
							mr={3}
							onClick={onClose}
							isDisabled={editMutation.isPending}
						>
							Anuleaza
						</Button>
						<Button
							type={"submit"}
							colorScheme="green"
							isLoading={editMutation.isPending}
						>
							Salveaza
						</Button>
					</ModalFooter>
				</ModalContent>
			</form>
		</Modal>
	);
};
