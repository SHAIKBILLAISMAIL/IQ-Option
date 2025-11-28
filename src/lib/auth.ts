import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";

// Helper to check if OAuth credentials are configured
const hasValidOAuthCredentials = (clientId?: string, clientSecret?: string) => {
	return (
		clientId &&
		clientSecret &&
		!clientId.includes('your-') &&
		!clientId.includes('REPLACE') &&
		!clientSecret.includes('your-') &&
		!clientSecret.includes('REPLACE')
	);
};

const googleEnabled = hasValidOAuthCredentials(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET
);

const facebookEnabled = hasValidOAuthCredentials(
	process.env.FACEBOOK_CLIENT_ID,
	process.env.FACEBOOK_CLIENT_SECRET
);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	...(googleEnabled || facebookEnabled ? {
		socialProviders: {
			...(googleEnabled ? {
				google: {
					clientId: process.env.GOOGLE_CLIENT_ID as string,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				},
			} : {}),
			...(facebookEnabled ? {
				facebook: {
					clientId: process.env.FACEBOOK_CLIENT_ID as string,
					clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
				},
			} : {}),
		},
	} : {}),
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	return session?.user || null;
}