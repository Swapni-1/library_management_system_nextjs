import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SearchBar from "@/app/_components/Search"
import AddStudent from "@/app/_components/AddStudent"
import { useEffect, useState } from "react"
import axios from "axios"
import DeleteDialogButton from "@/app/_components/DeleteDialogButton"
import UpdateStudent from "@/app/dashboard/update/UpdateStudent"
import useSWR from "swr"

export default function Student({selectedName}){

    const {data : studentData,mutate} = useSWR("/api/student",(url : string) => axios.get(url).then(({data}) => data));

    return (
        <div  className="w-full relative">
            <div className="text-2xl font-medium p-2 text-center">All Students Data</div>
            <AddStudent mutate={mutate} className={"absolute right-0 top-0"}/>
            {/* <div className="absolute -top-5 left-0">
                <SearchBar placeholder={"Search Students"}/>
            </div> */}
            <div className="p-2 mt-3 border border-gray-500 rounded-md">
                <Table>
                    <TableCaption className="text-black text-xl">{studentData && studentData.length === 0 && "No students data found."}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student id</TableHead>
                        <TableHead>Student name</TableHead>
                        <TableHead>Fathers name</TableHead>
                        <TableHead>Course name</TableHead>
                        <TableHead>Course type</TableHead>
                        <TableHead>Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody >

                      {
                        studentData && studentData.map((student,index) => (
                          <TableRow key={index}>
                            <TableCell>{student.student_id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.father_name}</TableCell>
                            <TableCell>{student.course_name}</TableCell>
                            <TableCell>{student.course_type}</TableCell>
                            <TableCell>{student.year}</TableCell>
                            <TableCell><UpdateStudent studentData={student} studentId={student.student_id} mutate={mutate}  className={"bg-green-500 hover:bg-green-500/90"}/></TableCell>
                            <TableCell><DeleteDialogButton deleteId={student.student_id} deleteType={"student"} mutate={mutate} title={"Are you sure about deleting this student data ?"}/></TableCell>
                          </TableRow>
                        ))
                      }
                      
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}