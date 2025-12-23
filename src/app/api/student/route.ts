import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){
    const userData = await prisma.student.findMany();
    return NextResponse.json(userData);
}

export async function POST(req : Request){
    const {
        student_id,student_name,
        father_name,course_name,
        course_type,year
    } = await req.json();

    const studentData = await prisma.student.create({
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