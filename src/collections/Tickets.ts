import type { CollectionConfig } from "payload";

export const Tickets: CollectionConfig = {
    slug: "tickets",
    admin: {
        useAsTitle: "name",
    },
    access: {
        read: () => true,
        create: ({ req }) => ["admin", "hr"].includes(req.user?.role),
        update: ({ req }) => ["admin", "hr"].includes(req.user?.role),
        delete: ({ req }) => ["admin", "hr"].includes(req.user?.role),
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
    ],
};
