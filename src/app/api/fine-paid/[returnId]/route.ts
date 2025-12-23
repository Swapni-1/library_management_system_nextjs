import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params{
    params : {
        returnId : string;
    }
}

export async function PUT(req:Request,{params} : Params){
    const {paid} = await req.json();
    const {returnId} = await params;

    const finePaidData = await prisma.bookReturn.update({
        where : {
            return_id : returnId
        },
        data : {
            paid
        }
    })

    return NextResponse.json(finePaidData);
}