import {prisma} from "@/lib/prisma"
import {NextResponse} from "next/server"

export async function POST(req : Request){
    const {username,email,password} = await req.json();

    const userData = await prisma.user.create({
        data : {
            username,
            email,
            password
        }
    })

    return NextResponse.json(userData);
}