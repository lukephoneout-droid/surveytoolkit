import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Credentials({
            name: "Development Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null
                // This is a placeholder for development. 
                // In production, use Zod to validate and Prisma to check password.
                if (credentials.email === "admin@example.com" && credentials.password === "password") {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: "admin@example.com",
                        role: "ADMIN",
                        orgId: "org-1",
                    }
                }
                return null
            },
        }),
    ],
} satisfies NextAuthConfig
