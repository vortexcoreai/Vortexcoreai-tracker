import { getServerSession } from "next-auth";
import { DynamicForm } from "@/components/dynamicForm";
import { authOptions } from "@/lib/auth";

export default async function Page() {
	const session = await getServerSession(authOptions);
	const currentUserId = session?.user?.id || "";

	return (
		<div className="min-h-screen">
			<div className="flex flex-col md:flex-row justify-between gap-4">
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
						{ name: "email", label: "Email", type: "email", required: true },
						{
							name: "password",
							label: "Password",
							type: "password",
							required: true,
						},
					]}
				/>
			</div>
		</div>
	);
}
