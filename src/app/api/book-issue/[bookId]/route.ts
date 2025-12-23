import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

interface Params{
    params : {
        bookId : string;
    }
}

export async function GET(req : Request,{params} : Params ){
    const {bookId} = await params;
    
    const bookIssueData = await prisma.bookIssue.findMany({
        where : {
            OR : [
                {
                    issue_id : bookId
                },
                {
                    book : {
                        some : {
                            book_id : bookId,
                        }
                    }
                }
            ]
            
        },
        include : {
            book : true,
            student : true
        }
    }) 

    return NextResponse.json(bookIssueData);
}

export async function PUT(req : Request,{params} : Params){
    const {bookId} = await params;
    const {issue_id,book_id,student_id,issueDate,dueDate} = await req.json();

    const issueBookData = await prisma.bookIssue.update({
        where : {
            issue_id : issue_id,
        },
        data : {
            issueDate,
            dueDate,
            student : {
                connect : {
                    student_id,
                }
            },
            book : {
                connect : {
                    book_id
                }
            }
        },

    })

    return NextResponse.json(issueBookData);
}

export async function DELETE(req : Request,{params} : Params){
    const {bookId} = await params;
    const returnBookData = await prisma.bookReturn.findUnique({where :{issue_id : bookId}});

    if(returnBookData){
        await prisma.bookIssue.delete({
            where : {
                issue_id : bookId
            }
        })

        await prisma.bookReturn.delete({
            where : {
                issue_id : bookId
            }
        })
    }else{
        await prisma.bookIssue.delete({
            where : {
                issue_id : bookId
            }
        })
    }
   

    return NextResponse.json({message : `issue_id : ${bookId} is successfully deleted`});

}