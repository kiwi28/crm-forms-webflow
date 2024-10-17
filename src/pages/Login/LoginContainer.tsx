import {
	Button,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import { useNavigate } from "react-router-dom";

interface ILoginData {
	email: string;
	password: string;
}

const schema = yup.object({
	email: yup.string().required(),
	password: yup.string().required(),
});

export const LoginContainer: React.FC = () => {
	const { isOpen, onToggle } = useDisclosure();
	const toast = useToast();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});
	const onSubmit = (data: ILoginData) => {
		loginMutation.mutate({ email: data.email, psw: data.password });
	};

	const loginMutation = useMutation({
		mutationFn: async ({ email, psw }: { email: string; psw: string }) =>
			await pb.collection("users").authWithPassword(email, psw),
		onSuccess: () => {
			toast({
				title: "Login successfully",
				description: pb.authStore.model?.email,
				status: "success",
			});
			console.log(pb.authStore);
			navigate("/");
		},
		onError: (error) => {
			toast({
				title: "Login failed!",
				description: error.message,
				status: "error",
			});
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Flex
				direction={"column"}
				alignItems={"center"}
				justifyContent={"center"}
				w={72}
				gap={4}
			>
				<Heading mb={4}>Login</Heading>

				<FormControl
					isDisabled={loginMutation.isPending}
					isInvalid={!!errors.email}
				>
					<FormLabel>Email</FormLabel>

					<Input
						{...register("email")}
						mb={1}
						placeholder={"example@domain.com"}
						isInvalid={!!errors.email}
						pr="4.5rem"
						autoComplete="email"
					/>

					{errors.password && (
						<FormHelperText
							lineHeight={"none"}
							color="red"
						>
							{errors.password.message}
						</FormHelperText>
					)}
				</FormControl>
				<FormControl
					isDisabled={loginMutation.isPending}
					isInvalid={!!errors.password}
				>
					<FormLabel>Password</FormLabel>

					<InputGroup size="md">
						<Input
							mb={1}
							placeholder={"Enter password"}
							{...register("password")}
							isInvalid={!!errors.password}
							pr="4.5rem"
							type={isOpen ? "text" : "password"}
							autoComplete="password"
						/>
						<InputRightElement width="4.5rem">
							<Button
								h="1.75rem"
								size="sm"
								onClick={onToggle}
							>
								{isOpen ? "Hide" : "Show"}
							</Button>
						</InputRightElement>
					</InputGroup>
					{errors.password && (
						<FormHelperText
							lineHeight={"none"}
							color="red"
						>
							{errors.password.message}
						</FormHelperText>
					)}
				</FormControl>
				<Button
					w={"100%"}
					mt={4}
					isLoading={loginMutation.isPending}
					type={"submit"}
				>
					Login
				</Button>
			</Flex>
		</form>
	);
};
