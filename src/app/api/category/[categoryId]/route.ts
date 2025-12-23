import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface Params{
    params : {
        categoryId : string;
    }
}

export async function PUT(req : Request,{params} : Params){
    const {categoryId} = await params;
    const {category_name} = await req.json();
    const slug = slugify(category_name,{lower : true,strict : true});


    const categoryData = await prisma.category.update({
        where : {
            category_id : categoryId,
        },
        data : {
            name : category_name,
            slug
        }
    })

    return NextResponse.json(categoryData);
}

export async function DELETE(req : Request,{params} : Params){
    const {categoryId} = await params;

    await prisma.category.delete({where : {category_id : categoryId}})

    return NextResponse.json({message : `categoryId : ${categoryId} is deleted successfully`})
}