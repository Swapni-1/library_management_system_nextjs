import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

interface Params{
    params : {
        bookId : string;
    }
}

export async function GET(req : Request,{params} : Params ){
    const {bookId} = await params;
    
    const bookReturnData = await prisma.bookReturn.findMany({
        where : {
            book : {
                some : {
                    book_id : bookId,
                }
            }
        },
        include : {
            book : true,
            student : true
        }
    }) 

    return NextResponse.json(bookReturnData);
}

export async function PUT(req : Request,{params} : Params){
    const {bookId} = await params;
    const {issue_id,book_id,student_id,returnDate,dueDate} = await req.json();

    const bookReturnData = await prisma.bookReturn.update({
        where : {
            return_id : bookId
        },
        data : {
            returnDate,
            dueDate,
            issue_id,
            book : {
                connect : {
                    book_id,
                }
            },
            student : { 
                connect : {
                    student_id,
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

export async function DELETE(req : Request,{params} : Params){
    const {bookId} = await params;
    await prisma.bookReturn.delete({
        where : {
            return_id : bookId
        }
    })

    return NextResponse.json({message : `returnId : ${bookId} is successfully deleted`});
}