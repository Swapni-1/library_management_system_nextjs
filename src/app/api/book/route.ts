import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){
    const bookData = await prisma.book.findMany({include : {category : true}})

    return NextResponse.json(bookData);
}


export async function POST(req : Request){
    const {book_id,book_name,description,
        price,publisher,published_year,bookImg,
        total_quantity,category} = await req.json();

    const bookData = await prisma.book.create({
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