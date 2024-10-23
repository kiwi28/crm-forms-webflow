import { useEffect } from "react";

import { RecordModel } from "pocketbase";
import { UseMutationResult } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useDisclosure,
} from "@chakra-ui/icons";

import { useMappingsCtx } from "@/lib/stores/MappingsCtx";
import { IBusinessData } from "@/lib/types/apiTypes";

type AddRowFormModalProps = {
	disclosure: ReturnType<typeof useDisclosure>;
	createRowMutation: UseMutationResult<
		RecordModel,
		Error,
		Partial<IBusinessData>,
		unknown
	>;
};

export const AddRowFormModal: React.FC<AddRowFormModalProps> = ({
	disclosure,
	createRowMutation,
}) => {
	const { isOpen, onClose } = disclosure;
	const mappings = useMappingsCtx();

	const defaultVal: { [x: string]: string } = {};
	Object.keys(mappings.map).map((key: string) => (defaultVal[key] = ""));

	const {
		handleSubmit,
		register,
		formState: { errors, isDirty },
	} = useForm<Partial<IBusinessData>>({
		defaultValues: defaultVal,
	});

	const onSubmit: SubmitHandler<Partial<IBusinessData>> = (data) => {
		console.log("submit data", data);
		createRowMutation.mutate(data);
	};

	useEffect(() => {
		if (Object.entries(errors).length) {
			console.error("error add row form", errors);
		}
	}, [errors]);

	useEffect(() => {
		if (createRowMutation.isSuccess) {
			onClose();
		}
	}, [createRowMutation.isSuccess, onClose]);

	return (
		<Modal
			size={"xl"}
			isOpen={isOpen}
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Creaza un rand nou</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{Object.keys(mappings.map).map((cellKey) => (
							<FormControl
								key={cellKey}
								isInvalid={!!errors?.[cellKey]}
							>
								<FormLabel>
									{mappings.map[cellKey].header}
									{mappings.map[cellKey].dynamicWidth ? (
										<Textarea {...register(cellKey)} />
									) : (
										<Input {...register(cellKey)} />
									)}
								</FormLabel>
								<FormErrorMessage>
									{errors?.[cellKey]?.message?.toString()}
								</FormErrorMessage>
							</FormControl>
						))}
					</ModalBody>

					<ModalFooter>
						<Button
							variant={"ghost"}
							mr={3}
							onClick={onClose}
							isDisabled={createRowMutation.isPending}
						>
							Anuleaza
						</Button>
						<Button
							type={"submit"}
							colorScheme="green"
							isLoading={createRowMutation.isPending}
							isDisabled={!isDirty}
						>
							Salveaza
						</Button>
					</ModalFooter>
				</ModalContent>
			</form>
		</Modal>
	);
};
