import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { DynamicEditForm } from "@/components/dynamicEditForm";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/apiFetch";
import { authOptions } from "@/lib/auth";

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	const session = await getServerSession(authOptions);
	const currentUserId = session?.user?.id || "";
	const data = await apiFetch(`/api/users/${id}`);

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
			<div className="w-full max-w-2xl">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-foreground">
							Edit User
						</h1>
						<p className="text-muted-foreground mt-2">
							Update user details below. Make sure all required fields are
							filled.
						</p>
					</div>
					<Link href="/manage/user/">
						<Button variant="outline" className="flex items-center gap-2">
							<ArrowLeft size={16} /> Back
						</Button>
					</Link>
				</div>

				<Card className="shadow-lg border border-border">
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							User Details
						</CardTitle>
						<CardDescription>
							Edit the information and click update to save changes.
						</CardDescription>
					</CardHeader>

					<Separator className="my-2" />

					<CardContent>
						<DynamicEditForm
							endpoint={`/api/users/${id}`}
							values={data}
							extraData={{ user: currentUserId }}
							fields={[
								{ name: "firstName", label: "First name", type: "text" },
								{ name: "lastName", label: "Last name", type: "text" },
								{ name: "email", label: "Email", type: "email" },
								{ name: "phone", label: "Phone number", type: "text" },
								{ name: "address", label: "Your address", type: "textarea" },
								{
									name: "role",
									label: "Role",
									type: "select",
									options: ["admin", "hr", "team_leader", "employee"],
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
