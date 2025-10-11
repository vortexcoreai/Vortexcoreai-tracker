import path from "path";

// import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from "@payloadcms/db-sqlite";

import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Attendance } from "./collections/Attendance";
import { Teams } from "./collections/Teams";
import { Leaves } from "./collections/Leaves";
import { Departments } from "./collections/departments";
import { Designations } from "./collections/designations";
import payloadSimpleRBAC, { starterRoles } from "@nouance/payload-simple-rbac";

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
	//   pool: {
	//     connectionString: process.env.DATABASE_URI || '',
	//   },
	// }),

	db: sqliteAdapter({
		client: {
			url: `file:${path.resolve(dirname, "dev.db")}`,
		},
	}),

	plugins: [
		payloadCloudPlugin(),
		// payloadSimpleRBAC({
		//   roles: ['employee', 'hr', 'admin', 'team_leader'],
		//   users: [Users.slug],
		//   defaultRole: 'employee',
		//   // addUserRoleField: true,
		//   // inherit: false,

		//   collections: [
		//     {
		//       slug: Leaves.slug,
		//       permissions: {
		//         read: ['admin'],
		//         create: ['admin'],
		//         update: ['admin'],
		//         delete: ['admin'],
		//       },
		//     },
		//   ],
		// }),
	],
});
