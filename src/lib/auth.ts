import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: credentials?.email,
							password: credentials?.password,
						}),
					},
				);

				const data = await res.json();

				if (!res.ok || !data.user) {
					return null;
				}

				return {
					id: data.user.id,
					email: data.user.email,
					role: data.user.role,
					token: data.token,
				};
			},
		}),
	],
	session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.token = user.token;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.token = token.token;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
