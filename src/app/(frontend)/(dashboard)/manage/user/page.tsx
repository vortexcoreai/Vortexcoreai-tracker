import Link from "next/link";
import { CustomTables } from "@/components/customTables";
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

export default async function Page() {
  const data = await apiFetch("/api/users");
  const user = data.docs || [];

  const header = [
    "id",
    "First Name",
    "Attendance",
    "Email",
    "Role",
    "Status",
    "Edit User",
    "Delete User",
  ];

  const tableData = user.map((item) => ({
    id: {
      value: item.id || "-",
      type: "normal-format",
    },
    firstName: {
      value: item.firstName || "-",
      type: "normal-format",
    },
    attendance: {
      value: "-",
      type: "link-format",
      link: `/manage/attendance/${item.id}`,
      userType: item.role || "employee",
    },
    email: {
      value: item.email || "-",
      type: "normal-format",
    },
    role: {
      value: item.role || "-",
      type: "normal-format",
    },
    status: {
      value: item.status || "-",
      type: "status-format",
    },
    editUser: {
      value: item.id || "-",
      type: "link-format",
      link: `/manage/user/edit/${item.id}`,
      userType: item.role || "employee",
    },
    deleteUser: {
      value: item.id || "-",
      type: "delete-format",
      url: `/api/users/${item.id}`,
      userType: item.role || "employee",
    },
  }));

  return (
    <div className="min-h-screen border-2 rounded-2xl bg-muted/30 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage existing users, update their roles, or invite new members.
            </p>
          </div>

          <Link href="/manage/user/add/">
            <Button size="lg" className="shadow-md">
              + Add User
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border border-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">User List</CardTitle>
            <CardDescription>
              A complete list of all users in the system with edit and delete
              options.
            </CardDescription>
          </CardHeader>

          <Separator className="my-2" />

          <CardContent>
            <CustomTables tableHeader={header} tableData={tableData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
