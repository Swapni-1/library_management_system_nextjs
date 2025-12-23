import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function GET(){
    const issuedBookData = await prisma.bookIssue.findMany({include :{book : true,student : true}});

    return NextResponse.json(issuedBookData);
}

export async function POST(req : Request){ 
    const {bookId,studentId,issueDate,dueDate} = await req.json();

    const issueBookData = await prisma.bookIssue.create({
        data : {
            issueDate,
            dueDate,
            student : {
                connect : {
                    student_id : studentId
                }
            },
            book : {
                connect : {
                    book_id : bookId
                }
            }
        },
        include : {
            student : true,
            book : true
        }
    })

    return NextResponse.json(issueBookData);
}