import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcrypt"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import db from "./db"

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                senha: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.senha) {
                    return null;
                }
                const existingUser = await db.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })
                if (!existingUser) {
                    return null
                }
                const senhaMatch = await compare(credentials.senha, existingUser.senha);
                if (!senhaMatch) {
                    return null;
                }
                return {
                    id: `${existingUser.id}`,
                    nome: existingUser.nome,
                    sobrenome: existingUser.sobrenome,
                    email: existingUser.email
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    nome: user.nome,
                    sobrenome: user.sobrenome,
                }
            }
            return token
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    nome: token.nome,
                    sobrenome: token.sobrenome,
                }
            }
        }
    }
}

export default authOptions;
