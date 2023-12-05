import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"

import { db, db as prisma } from "@/lib/db"

import bcrypt from "bcrypt"


export const authOptions : NextAuthOptions = {
    // @see https://github.com/prisma/prisma/issues/16117
    // @ts-ignore
    adapter: PrismaAdapter(prisma as any),
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_CLIENTID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        CredentialProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text", placeholder: "John Smith" },
            },
            async authorize(credentials, req) : Promise<any>{

                //console.log("Authorize method", credentials)


                if(!credentials?.email || !credentials?.password) throw new Error("Dados de Login necessarios")

                const user = await prisma.user.findUnique({
                    where:{
                        email: credentials?.email
                    }
                })

                //console.log("USER", user)

                if(!user || !user.hashedPassword) {
                    throw new Error("Usuários não registrado através de credenciais")
                }

                const matchPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
                if(!matchPassword)
                    throw new Error("Senha incorreta")

                return user



            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    callbacks: {
        async session({ token, session }) {
          if (token) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.image = token.picture
            session.user.role = token.role
          }
    
          return session
        },
    
        async jwt({ token, user }) {
          const dbUser = await db.user.findFirst({
            where: {
              email: token.email,
            },
          })

          if (!dbUser) {
            token.id = user!.id
            return token
          }    
              
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
            role: dbUser.role,
          }
        }
                
      },
    pages: {
        signIn: "/login"
    }
}