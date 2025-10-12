import payloadSimpleRBAC, { starterRoles } from "@nouance/payload-simple-rbac";

// import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";

import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { Attendance } from "./collections/Attendance";
import { Departments } from "./collections/departments";
import { Designations } from "./collections/designations";
import { Leaves } from "./collections/Leaves";
import { Teams } from "./collections/Teams";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Users, Attendance, Teams, Leaves, Departments, Designations],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},

	// db: postgresAdapter({
	// 	pool: {
	// 		connectionString: process.env.DATABASE_URI || "",
	// 	},
	// }),

	db: sqliteAdapter({
		client: {
			url: `file:${path.resolve(dirname, "dev.db")}`,
		},
	}),

	plugins: [payloadCloudPlugin()],
});
