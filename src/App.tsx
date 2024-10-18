import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { PageLayout } from "./components/PageLayout";
import { BrowserRouter } from "react-router-dom";
import { CustomRouter } from "./components/CustomRouter";

function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider>
				<PageLayout>
					<BrowserRouter>
						<CustomRouter />
					</BrowserRouter>
				</PageLayout>
			</ChakraProvider>
		</QueryClientProvider>
	);
}

export default App;
