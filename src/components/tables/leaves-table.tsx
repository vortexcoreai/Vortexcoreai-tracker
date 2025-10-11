"use client";

import React, { useState } from "react";
import {
	CheckCircle2Icon,
	Eye,
	LoaderIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Dialog } from "@radix-ui/react-dialog";
import { CustomDialog } from "../dialog";

export function AttendanceTable({ tableHeader, tableData }) {
	const [data, setData] = useState([...tableData].reverse());
	const [loading, setLoading] = useState(false);

	return (
		<>
			<Table>
				<TableHeader className="sticky top-0 z-10 bg-muted">
					<TableRow>
						{tableHeader.map((header, index) => (
							<TableHead key={index}>{header}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length ? (
						data.map((row) => (
							<TableRow key={row.id}>
								<TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="px-1.5 text-muted-foreground"
									>
										{row.clockIn
											? new Date(row.clockIn).toLocaleTimeString()
											: "-"}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="px-1.5 text-muted-foreground"
									>
										{row.clockOut
											? new Date(row.clockOut).toLocaleTimeString()
											: "-"}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="flex gap-1 px-1.5 text-muted-foreground"
									>
										{row.status === "Done" ? (
											<CheckCircle2Icon className="text-green-500 dark:text-green-400 size-3" />
										) : (
											<LoaderIcon className="size-3" />
										)}
										{row.status}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="px-1.5 text-muted-foreground"
									>
										{row.workDuration || "-"}
									</Badge>
								</TableCell>
								<TableCell>
									{row.breaks.map((b, index) => {
										const start = new Date(b.breakStartTime).toLocaleTimeString(
											[],
											{ hour: "2-digit", minute: "2-digit" },
										);
										const end = new Date(b.breakEndTime).toLocaleTimeString(
											[],
											{ hour: "2-digit", minute: "2-digit" },
										);
										const durationMinutes = Math.round(
											b.totalBreakTime / 1000 / 60,
										);

										return (
											<div key={b.id || index} style={{ marginBottom: 4 }}>
												{start} - {end} ({durationMinutes} min)
											</div>
										);
									})}
								</TableCell>

								<TableCell>
									<CustomDialog
										title="DWR"
										subtitle={"your dwr records"}
										date={new Date(row.date).toLocaleDateString()}
										content={row.dwr}
									/>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={7} className="h-24 text-center">
								No records found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</>
	);
}
