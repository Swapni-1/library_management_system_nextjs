import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter : PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials : {
        username : {
          label : "Username",
          type : "text"
        },
        password : {
          label : "Password",
          type : "password"
        }
      },
      authorize : async (credentials) =>{
        const user = await prisma.user.findFirst({
          where: { 
               OR : [
                {
                  username : credentials.username as string
                },
                {
                  email : credentials.username as string
                }
               ]
           },
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
  trustHost : true,
  session : {
    strategy : "jwt"
  },
  debug : process.env.NODE_ENV === "development",
  secret : process.env.AUTH_SECRET,
})