import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

interface Params {
    params : {
        bookId : string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {bookId} = await params;
    const bookData = await prisma.book.findMany({
        where : {
            OR : [
                {
                    category : {
                        some : {
                            slug : bookId
                        }
                    }
                },
                {
                    book_id : bookId
                }
            ]
            
        },
        include :{
            category : true,
            bookIssue : true,
            bookReturn : true
        }
    })

    return NextResponse.json(bookData);
}

export async function PUT(req : Request,{ params } : Params){
    const {bookId} = await params;
    const {book_id,book_name,description,
        price,publisher,published_year,bookImg,
        total_quantity,category} = await req.json();
    
        const bookData = await prisma.book.update({
            where : {
                book_id : bookId
            },
            data : {
                book_id,
                name : book_name,
                description,
                price : parseInt(price),
                publisher,
                published_year,
                bookImg,
                total_quantity : parseInt(total_quantity),
                category : {
                    connect : category.map(({value}) => ({ slug : value}))
                }
            },
            include : {
                category : true
            }
        })
    
        return NextResponse.json(bookData);
}

export async function DELETE(req : Request,{ params } : Params){
    const {bookId} = await params;

    await prisma.book.delete({where : {book_id : bookId}})
    
    return NextResponse.json({message : `bookId : ${bookId} is deleted successfully`});
}