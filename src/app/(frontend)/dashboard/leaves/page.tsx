import { getServerSession } from "next-auth";
import { CustomTables } from "@/components/customTables";
import { DynamicForm } from "@/components/dynamicForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { authOptions } from "@/lib/auth";

export default async function Page() {
	const session = await getServerSession(authOptions);
	const currentUserId = session?.user?.id || "";

	const data = await apiFetch("/api/leaves");
	const leaves = data.docs;

	const tableHeader = ["From", "To", "Approved By", "Status", "Reason"];

	const tableData = leaves.map((item) => ({
		from: {
			value: item.from || "-",
			type: "date-format",
		},
		to: {
			value: item.to || "-",
			type: "date-format",
		},
		approvedBy: {
			value: item.approvedBy || "-",
			type: "user-format",
		},
		status: {
			value: item.status || "-",
			type: "status-format",
		},
		reason: {
			value: item.reason || "-",
			type: "dialog-format",
			title: "Leave details",
			subtitle: "Your leave request details are being reviewed.",
		},
	}));

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

				<CustomTables tableHeader={tableHeader} tableData={tableData} />
			</div>
		</div>
	);
}
