import { getServerSession } from "next-auth";
import { DynamicForm } from "@/components/dynamicForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth";

export default async function Page() {
	const session = await getServerSession(authOptions);
	const currentUserId = session?.user?.id || "";

	return (
		<div className="min-h-screen border-2 rounded-2xl bg-muted/30 flex items-center justify-center p-6">
			<div className="w-full max-w-2xl">
				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						User Registration
					</h1>
					<p className="text-muted-foreground mt-2">
						Create a new user account by filling in the details below.
					</p>
				</div>

				<Card className="shadow-lg border border-border">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							Registration Form
						</CardTitle>
						<CardDescription>
							Enter your personal details and click submit to create an account.
						</CardDescription>
					</CardHeader>

					<Separator className="my-2" />

					<CardContent>
						<DynamicForm
							endpoint="/api/users"
							extraData={{ user: currentUserId }}
							fields={[
								{
									name: "firstName",
									label: "First Name",
									type: "text",
									required: true,
								},
								{
									name: "lastName",
									label: "Last Name",
									type: "text",
									required: false,
								},
								{
									name: "email",
									label: "Email",
									type: "email",
									required: true,
								},
								{
									name: "password",
									label: "Password",
									type: "password",
									required: true,
								},
							]}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
