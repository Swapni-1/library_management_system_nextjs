import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function POST(req : Request){
    const data = await req.json();
    const {email,password} = data;
    const isUserExists = await prisma.user.findUnique({
        where : { email }
    });

    if(!isUserExists){
        return NextResponse.json({isExts : false,msg : "User does'nt exists please create new account."})
    }

    return NextResponse.json({isExts : true,msg : "User exists please login"});
}