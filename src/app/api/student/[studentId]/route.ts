import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params : {
        studentId : string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {studentId} = await params;

    const studentData = await prisma.student.findUnique({
        where : {student_id : studentId},
        include : {
            bookIssue : {
                include : {
                    book : true
                }
            },
            bookReturn : {
                include : {
                    book : true
                }
            }
        }
    });

    return NextResponse.json(studentData);
}

export async function PUT(req : Request,{ params } : Params){
    const {studentId} = await params;
    
    const {
        student_id,student_name,
        father_name,course_name,
        course_type,year
    } = await req.json();

    const studentData = await prisma.student.update({
        where : {
            student_id : studentId,
        },
        data : {
            student_id,
            name : student_name,
            father_name,
            course_name,
            course_type,
            year
        }
    })

    return NextResponse.json(studentData);
}

export async function DELETE(req : Request,{ params } : Params){
    const {studentId} = await params;

    await prisma.student.delete({where : {student_id : studentId}})

    return NextResponse.json({message : `studentId : ${studentId} is deleted successfully`})

}