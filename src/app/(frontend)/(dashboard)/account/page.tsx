import { Edit, Star, Users } from "lucide-react";
import Image from "next/image";
import { ThemeChanger } from "@/components/themeChanger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/apiFetch";
import { authCheck } from "@/lib/authCheck";

export default async function Page() {
	authCheck();
	const data = await apiFetch("/api/users/me");
	const user = data.user;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-10 md:px-6 2xl:max-w-[1400px]">
				<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
					<div className="flex gap-2">
						<Button variant="outline" className="gap-2">
							<Edit className="size-4" />
							Edit
						</Button>
						<ThemeChanger />
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-4">
					<div className="md:col-span-1">
						<Card className="border-border/50 shadow-sm">
							<CardContent className="p-6">
								<div className="flex flex-col items-center text-center">
									<div className="relative h-24 w-24 overflow-hidden rounded-full ring-1 ring-border/40">
										<Image
											alt="User Avatar"
											src="/cat.gif"
											width={96}
											height={96}
											className="object-cover"
										/>
									</div>
									<h2 className="mt-4 text-lg font-semibold">
										{user.firstName} {user.lastName}
									</h2>
									<p className="text-sm text-muted-foreground capitalize">
										{user.role}
									</p>
									<Button
										variant="secondary"
										className="mt-4 w-full truncate gap-2 text-xs sm:text-sm"
									>
										{user.email}
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-8 md:col-span-3">
						<div className="grid gap-4 sm:grid-cols-2">
							{[
								{
									icon: <Star className="size-5 text-primary" />,
									value:
										user.dateOfJoining && user.dateOfJoining !== "null"
											? new Date(user.dateOfJoining).toLocaleDateString()
											: "—",
									label: "Date of Joining",
								},
								{
									icon: <Users className="size-5 text-primary" />,
									value: user.status || "—",
									label: "Status",
								},
							].map((stat) => (
								<Card
									key={stat.value}
									className="transition-all hover:shadow-sm border-border/50"
								>
									<CardContent className="flex items-center gap-4 py-2 px-6">
										<div className="rounded-md bg-primary/10 p-2">
											{stat.icon}
										</div>
										<div>
											<p className="text-lg font-semibold">{stat.value}</p>
											<p className="text-sm text-muted-foreground">
												{stat.label}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<Card className="border-border/50 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									User Information
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4 sm:grid-cols-2">
								{[
									{ label: "ID", value: user.id },
									{ label: "First Name", value: user.firstName },
									{ label: "Last Name", value: user.lastName },
									{ label: "Email", value: user.email },
									{ label: "Phone", value: user.phone },
									{ label: "Address", value: user.address },
									{ label: "Role", value: user.role },
									{ label: "Status", value: user.status },
									{
										label: "Department",
										value: user.department?.name || "—",
									},
									{
										label: "Designation",
										value: user.designation?.title || "—",
									},
									{
										label: "Created At",
										value: new Date(user.createdAt).toLocaleString(),
									},
									{
										label: "Updated At",
										value: new Date(user.updatedAt).toLocaleString(),
									},
									{
										label: "Team",
										value: user.team || "—",
									},
								].map((item) => (
									<div
										key={item.value}
										className="flex flex-col rounded-lg border border-border/40 bg-muted/20 p-3 transition-all hover:bg-muted/30"
									>
										<span className="text-xs text-muted-foreground">
											{item.label}
										</span>
										<span className="truncate text-sm font-medium text-foreground">
											{item.value ?? "—"}
										</span>
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
