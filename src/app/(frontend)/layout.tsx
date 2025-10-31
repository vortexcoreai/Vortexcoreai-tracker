"use client";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";

export default function RootLayout({ children }: { children }) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<QueryClientProvider client={queryClient}>
					<SessionProviderWrapper>{children}</SessionProviderWrapper>
				</QueryClientProvider>
			</body>
		</html>
	);
}
