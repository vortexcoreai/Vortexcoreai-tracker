import { CustomTables } from "@/components/customTables";
import { apiFetch } from "@/lib/api";

export default async function Page() {
	const data = await apiFetch(
		"/api/attendance?where[date][greater_than_equal]=2025-10-01&where[date][less_than_equal]=2025-10-31&limit=100&sort=date",
	);
	const attendance = data.docs;
	console.log(attendance);

	const header = [
		"Date",
		"Clock In",
		"Clock Out",
		"Breaks",
		"Status",
		"Approved By",
		"DWR",
	];

	const tableData = attendance.map((item) => ({
		date: {
			value: item.date || "-",
			type: "date-format",
		},
		clockIn: {
			value: item.clockIn || "-",
			type: "time-format",
		},
		clockOut: {
			value: item.clockOut || "-",
			type: "time-format",
		},
		breaks: {
			value: item.breaks || "-",
			type: "break-format",
		},
		status: {
			value: item.status || "-",
			type: "status-format",
		},
		approvedBy: {
			value: item.approvedBy || "-",
			type: "user-format",
		},
		reason: {
			value: item.dwr || "-",
			type: "dialog-format",
			title: "DWR",
			subtitle: "your dwr records",
		},
	}));
	return <CustomTables tableHeader={header} tableData={tableData} />;
}
