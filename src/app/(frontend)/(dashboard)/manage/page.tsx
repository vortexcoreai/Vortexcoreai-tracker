"use client";

import { CalendarDays, ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
	return (
		<div className="p-8 space-y-8">
			{/* Header */}
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">Manage Dashboard</h1>
				<p className="text-muted-foreground">
					Control users, attendance, and leaves from a single place.
				</p>
			</div>

			<Separator />

			{/* Cards Grid */}
			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{/* Card Template */}
				{[
					{
						icon: User,
						title: "Manage Users",
						desc: "Add, edit, or remove users and control roles.",
						content:
							"View the complete user directory and manage access permissions efficiently across departments.",
						button: "Open Users",
						link: "/manage/user",
					},
					{
						icon: CalendarDays,
						title: "Manage Attendance",
						desc: "Track daily clock-ins, clock-outs & hours.",
						content:
							"Monitor attendance logs, analyze punctuality, and approve correction requests seamlessly.",
						button: "Open Attendance",
						link: "/manage/attendance",
					},
					{
						icon: ClipboardList,
						title: "Manage Leaves",
						desc: "Approve and review employee leave requests.",
						content:
							"View pending and approved leave requests, maintain transparency, and keep track of balances.",
						button: "Open Leaves",
						link: "/manage/leaves",
					},
				].map((item) => {
					const Icon = item.icon;
					return (
						<Card
							key={item.title}
							className="group relative overflow-hidden border border-border/50 rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
						>
							{/* Gradient hover layer */}
							<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

							{/* Card Content (z-10 to stay above gradient) */}
							<div className="relative z-10 flex flex-col h-full">
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
											<Icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<CardTitle className="text-lg font-semibold">
												{item.title}
											</CardTitle>
											<CardDescription className="text-sm">
												{item.desc}
											</CardDescription>
										</div>
									</div>
								</CardHeader>

								<CardContent className="flex-grow">
									<p className="text-sm text-muted-foreground leading-relaxed">
										{item.content}
									</p>
								</CardContent>

								<CardFooter className="flex justify-end">
									<Link href={item.link}>
										<Button
											variant="secondary"
											size="sm"
											className="group/button hover:bg-primary hover:text-primary-foreground transition-all"
										>
											{item.button}
										</Button>
									</Link>
								</CardFooter>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
