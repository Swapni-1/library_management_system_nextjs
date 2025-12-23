import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials";
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials : {
        email : {
          label : "Email",
          type : "text"
        },
        password : {
          label : "Password", 
          type : "password",
        }
      },
      authorize : async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { username: credentials.email as string },
        });

        if(!user){
          throw new Error("Invalid credentials");
        }

        if(user.password !== credentials.password){
          throw new Error("Invalid credentials");
        }

        return user;
      }
    })
  ],
  session : {
    strategy : "jwt",
  },
  debug : process.env.NODE_ENV === "development",
  secret : process.env.AUTH_SECRET
})