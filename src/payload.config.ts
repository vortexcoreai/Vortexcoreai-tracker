import path from "node:path";
import { fileURLToPath } from "node:url";
// import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
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

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),

  // db: sqliteAdapter({
  // 	client: {
  // 	url: process.env.DATABASE_URL || 'sqlite:./data.db',
  // 	},
  // }),

  plugins: [],
});
