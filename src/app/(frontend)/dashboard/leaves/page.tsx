import { format } from "date-fns";
import { apiFetch } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { DynamicForm } from "@/components/dynamicForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default async function Page() {
	const session = await getServerSession(authOptions);
	const currentUserId = session?.user?.id || "";

	const data = await apiFetch("/api/leaves");
	const leaves = data.docs;

	return (
		<div className="min-h-screen">
			<div className="space-y-8 mx-auto">
				<div className="text-center">
					<h1 className="text-4xl font-bold">Leave Management</h1>
					<p className="mt-2">View and apply for your leaves</p>
				</div>

				<div className="flex flex-col md:flex-row justify-between gap-4">
					<Card className="w-full shadow-md border">
						<CardHeader>
							<CardTitle className="text-lg font-semibold">
								Apply for Leave
							</CardTitle>
						</CardHeader>
						<CardContent>
							<DynamicForm
								endpoint="/api/leaves"
								extraData={{ user: currentUserId, status: "pending" }}
								fields={[
									{ name: "from", label: "From", type: "date", required: true },
									{ name: "to", label: "To", type: "date", required: true },
									{
										name: "reason",
										label: "Reason",
										type: "textarea",
										required: true,
									},
								]}
							/>
						</CardContent>
					</Card>

					<Card className="w-full shadow-md border">
						<CardHeader>
							<CardTitle className="text-lg font-semibold">
								Leaves Overview
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Additional stats/filters can go here */}
						</CardContent>
					</Card>
				</div>

				<Card className="shadow-sm border">
					<CardHeader>
						<CardTitle className="text-lg font-semibold">
							Previous Leaves
						</CardTitle>
					</CardHeader>
					<CardContent className="bg-accent p-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>From</TableHead>
									<TableHead>To</TableHead>
									<TableHead>Reason</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Approved By</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leaves.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-6">
											No previous leaves found.
										</TableCell>
									</TableRow>
								) : (
									leaves.map((leave) => (
										<TableRow key={leave.id}>
											<TableCell>
												{leave.from
													? format(new Date(leave.from), "dd MMM yyyy")
													: "-"}
											</TableCell>
											<TableCell>
												{leave.to
													? format(new Date(leave.to), "dd MMM yyyy")
													: "-"}
											</TableCell>
											<TableCell>{leave.reason || "-"}</TableCell>
											<TableCell>{leave.status || "-"}</TableCell>
											<TableCell>{leave.approvedBy?.id || "-"}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
