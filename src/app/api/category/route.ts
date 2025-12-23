import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server";
import slugify from "slugify"

export async function GET(){
    const categoryData = await prisma.category.findMany();
    return NextResponse.json(categoryData);
}

export async function POST(req : Request){
    const {category_name} = await req.json();
    const slug = slugify(category_name,{lower : true,strict : true});


    const categoryData = await prisma.category.create({
        data : {
            name : category_name,
            slug
        }
    })

    return NextResponse.json(categoryData);
}