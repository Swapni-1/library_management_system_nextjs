import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(){
    const returnedBookData = await prisma.bookReturn.findMany({include : {book:true,student:true}});
    
    return NextResponse.json(returnedBookData);
}

export async function POST(req : Request){
    const {issueId,bookId,studentId,returnDate,dueDate} = await req.json();

    const bookReturnData = await prisma.bookReturn.create({
        data : {
            returnDate,
            dueDate,
            issue_id : issueId,
            book : {
                connect : {
                    book_id : bookId,
                }
            },
            student : { 
                connect : {
                    student_id : studentId,
                }
            }

        },
        include : {
            book : true,
            student : true,
        }
    })

    return NextResponse.json(bookReturnData);
}