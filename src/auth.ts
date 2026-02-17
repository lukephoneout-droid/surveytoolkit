import NextAuth from "next-auth"
import type { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "@/lib/db"
import authConfig from "./auth.config"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            orgId: string
            role: string
        } & DefaultSession["user"]
    }
}



export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.orgId && session.user) {
                session.user.orgId = token.orgId as string
            }

            if (token.role && session.user) {
                session.user.role = token.role as string
            }

            return session
        },
        async jwt({ token }: { token: any }) {
            if (!token.sub) return token

            const dbUser = await db.user.findUnique({
                where: { id: token.sub },
                select: {
                    orgId: true,
                    role: true,
                },
            })

            if (dbUser) {
                token.orgId = dbUser.orgId
                token.role = dbUser.role
            }

            return token
        },
    },
    ...authConfig,
})
