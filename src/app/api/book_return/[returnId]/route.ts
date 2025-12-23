import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params{
    params : {
        returnId : string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {returnId} = await  params;
    
    const bookReturnData = await prisma.bookReturn.findUnique({
        where : {
            OR : [
                {
                    return_id : returnId,
                },
                {
                    is
                }
            ]
        }
    })
    
    return NextResponse.json(bookReturnData);
}