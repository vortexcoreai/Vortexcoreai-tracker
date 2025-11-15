import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/apiFetch";

export default async function Page() {
  const data = await apiFetch("/api/users/me");
  const user = data.user;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 md:px-8 lg:px-12 2xl:max-w-[1400px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Left Section */}
          <div className="md:col-span-4 lg:col-span-3">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full ring-1 ring-border/40">
                  <Image
                    alt="User Avatar"
                    src="/cat.gif"
                    width={120}
                    height={120}
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
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="mt-6 grid gap-4">
              {[
                {
                  icon: <Star className="size-5 text-primary" />,
                  value:
                    user.dateOfJoining && user.dateOfJoining !== "null"
                      ? new Date(user.dateOfJoining).toLocaleDateString()
                      : "—",
                  label: "Date of Joining",
                },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="border-border/50 shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-4 py-4 px-6">
                    <div className="rounded-md bg-primary/10 p-2">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-lg font-semibold leading-none">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="md:col-span-8 lg:col-span-9">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    label: "ID",
                    value: user.id,
                  },
                  {
                    label: "First Name",
                    value: user.firstName,
                  },
                  {
                    label: "Last Name",
                    value: user.lastName,
                  },
                  {
                    label: "Email",
                    value: user.email,
                  },
                  {
                    label: "Phone",
                    value: user.phone || "—",
                  },
                  {
                    label: "Address",
                    value: user.address || "—",
                  },
                  {
                    label: "Role",
                    value: user.role,
                  },
                  {
                    label: "Status",
                    value: user.status,
                  },
                  {
                    label: "Department",
                    value: user.department?.name || "—",
                  },
                  {
                    label: "Designation",
                    value: user.designation?.title || "—",
                  },
                  {
                    label: "Team",
                    value: user.team || "—",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
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
