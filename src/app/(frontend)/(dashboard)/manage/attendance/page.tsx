import { CustomDropdown } from "@/components/customDropdown";
import { CustomTables } from "@/components/customTables";
import { apiFetch } from "@/lib/api";

export default async function Page({ searchParams }) {
	const resolvedParams = await searchParams;

	const year = resolvedParams?.year || new Date().getFullYear();
	const month = resolvedParams?.month || new Date().getMonth() + 1;
	const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
	const lastDate = new Date(Number(year), Number(month), 1)
		.toISOString()
		.split("T")[0];

	const data = await apiFetch(
		`/api/attendance?where[date][greater_than_equal]=${startDate}&where[date][less_than_equal]=${lastDate}&limit=100&sort=date`,
	);

	const attendance = data.docs;

	const months = [
		{ January: 1 },
		{ February: 2 },
		{ March: 3 },
		{ April: 4 },
		{ May: 5 },
		{ June: 6 },
		{ July: 7 },
		{ August: 8 },
		{ September: 9 },
		{ October: 10 },
		{ November: 11 },
		{ December: 12 },
	];
	const years = [
		{ "2022": 2022 },
		{ "2023": 2023 },
		{ "2024": 2024 },
		{ "2025": 2025 },
		{ "2026": 2026 },
	];

	const header = [
		"Id",
		"Date",
		"Clock In",
		"Clock Out",
		"Breaks",
		"Status",
		"Approved By",
		"DWR",
	];

	const tableData = attendance.map((item) => ({
		id: { value: item.id || "-", type: "date-format" },
		date: { value: item.date || "-", type: "date-format" },
		clockIn: { value: item.clockIn || "-", type: "time-format" },
		clockOut: { value: item.clockOut || "-", type: "time-format" },
		breaks: { value: item.breaks || "-", type: "break-format" },
		status: { value: item.status || "-", type: "status-format" },
		approvedBy: { value: item.approvedBy || "-", type: "user-format" },
		reason: {
			value: item.dwr || "-",
			type: "dialog-format",
			title: "DWR",
			subtitle: "your dwr records",
		},
	}));

	return (
		<>
			<div className="mb-4 flex gap-4">
				<CustomDropdown title="Months" data={months} params="month" />
				<CustomDropdown title="Years" data={years} params="year" />
			</div>

			<CustomTables tableHeader={header} tableData={tableData} />
		</>
	);
}
