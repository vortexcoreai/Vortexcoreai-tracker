import { CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { CustomDialog } from "./dialog";

export function CustomTables({ tableHeader, tableData }) {
	const data = [...tableData].reverse();

	return (
		<div className="relative flex flex-col gap-4 overflow-auto">
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-muted">
						<TableRow>
							{tableHeader.map((header, index) => (
								<TableHead key={`unique-key-${index + index}`}>
									{header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{data.length ? (
							data.map((row, i) => (
								<TableRow key={row.id}>
									{Object.keys(row).map((key) => {
										const cell = row[key];

										switch (cell.type) {
											case "date-format":
												return (
													<TableCell key={cell.id}>
														<Badge
															variant="outline"
															className="px-1.5 text-muted-foreground"
														>
															{new Date(cell.value).toLocaleDateString()}
														</Badge>
													</TableCell>
												);

											case "time-format":
												return (
													<TableCell key={cell.id}>
														<Badge
															variant="outline"
															className="px-1.5 text-muted-foreground"
														>
															{new Date(cell.value).toLocaleTimeString()}
														</Badge>
													</TableCell>
												);

											case "status-format":
												return (
													<TableCell key={`status-format-${cell.id + i}`}>
														<Badge
															variant="outline"
															className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white 
                        ${
													cell.value === "pending"
														? "bg-yellow-500"
														: cell.value === "present" ||
																cell.value === "success"
															? "bg-green-500"
															: "bg-red-500"
												}`}
														>
															{cell.value === "pending" ? (
																<LoaderIcon className="size-3 animate-spin" />
															) : (
																<CheckCircle2Icon className="size-3" />
															)}
															{cell.value}
														</Badge>
													</TableCell>
												);

											case "user-format":
												return (
													<TableCell key={`user-format-${cell.type + i}`}>
														<Badge
															variant="outline"
															className="px-1.5 text-muted-foreground"
														>
															👤 {cell.value}
														</Badge>
													</TableCell>
												);

											case "break-format":
												return (
													<TableCell key={`break-format-${cell.value}`}>
														<Badge
															variant="outline"
															className="px-1.5 text-muted-foreground flex flex-col"
														>
															{cell.value.map((b, index) => {
																const start = new Date(
																	b.breakStartTime,
																).toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit",
																});
																const end = new Date(
																	b.breakEndTime,
																).toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit",
																});
																const durationMinutes = Math.round(
																	b.totalBreakTime / 1000 / 60,
																);
																return (
																	<div
																		key={b.id || index}
																		style={{ marginBottom: 4 }}
																	>
																		{start} - {end} ({durationMinutes} min)
																	</div>
																);
															})}
														</Badge>
													</TableCell>
												);

											case "dialog-format":
												return (
													<TableCell key={`dialog-format-${i + i}`}>
														<CustomDialog
															title={cell.title}
															subtitle={cell.subtitle}
															content={cell.value}
														/>
													</TableCell>
												);

											default:
												return (
													<TableCell key={`unique-key-${cell.type + i}`}>
														{cell.value}
													</TableCell>
												);
										}
									})}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={tableHeader.length} className="text-center">
									No data available
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
