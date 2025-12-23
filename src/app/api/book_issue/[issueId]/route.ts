import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params : {
        issueId : string;
    }
}

export async function GET(req :Request,{params} : Params){
    const {issueId} = await params;
    const bookIssueData = await prisma.bookIssue.findUnique({
        where : {
            issue_id : issueId
        },
        include : {
            student : true,
            book : true
        }
    })
    
    return NextResponse.json(bookIssueData);
}