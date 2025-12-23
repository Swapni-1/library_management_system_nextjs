import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SearchBar from "@/app/_components/Search"
import IssueBook from "@/app/_components/IssueBook";
import { useEffect, useState } from "react";
import axios from "axios";
import UpdateIssuedBook from "@/app/dashboard/update/UpdateIssuedBook";
import DeleteDialogButton from "@/app/_components/DeleteDialogButton";
import useSWR from "swr";
import { date } from "@/lib/date";

export default function IssuedBook({selectedName}){

    const {data : issuedBookData,mutate} = useSWR("/api/book-issue",(url) => axios.get(url).then(({data}) => data))

    const [bookData,setBookData] = useState([]);
    const [studentData,setStudentData] = useState([]);

    useEffect(() => {
      getBookData();
      getStudentData();
    },[selectedName])

    function getBookData(){
      axios.get("/api/book")
      .then(({data}) => {
        setBookData(data);
      })
      .catch((error) => {
        console.log(error);
      })
    }

    function getStudentData(){
      axios.get("/api/student")
      .then(({data}) => {
        setStudentData(data);
      })
      .catch((error) => {
        console.log(error);
      })
    }
    return (
        <div  className="w-full relative">
            <div className="text-2xl font-medium p-2 text-center">All Issued Book Data</div>
            <IssueBook mutate={mutate} bookData={bookData} studentData={studentData} className={"absolute right-0 top-0"}/>
            {/* <div className="absolute -top-5 left-0">
                <SearchBar placeholder={"Search Issued book"}/>
            </div> */}
            <div className="p-2 mt-3 border border-gray-500 rounded-md">
                <Table>
                    <TableCaption className="text-xl text-black">{issuedBookData && issuedBookData.length === 0 && "No issued book data found."}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial no.</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>BookName</TableHead>
                        <TableHead>Issued Date</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody >
                    {
                      issuedBookData && issuedBookData.map((issuedBook,index) => (
                        <TableRow key={index}>
                          <TableCell>{index+1}</TableCell>
                          <TableCell>{issuedBook.student[0].name}</TableCell>
                          <TableCell>{issuedBook.book[0].name.length > 15 ? issuedBook.book[0].name.slice(0,15)+"...":issuedBook.book[0].name }</TableCell>
                          <TableCell>{date(issuedBook.issueDate)}</TableCell>
                          <TableCell>{date(issuedBook.dueDate)}</TableCell>
                          <TableCell><UpdateIssuedBook issuedBookId={issuedBook.issue_id} issuedBookData={issuedBook} mutate={mutate} className={"bg-green-500 hover:bg-green-500/90"}/></TableCell>
                          <TableCell><DeleteDialogButton deleteType={"issued-book"} disabled={false} mutate={mutate} deleteId={issuedBook.issue_id} title={"Are you sure about deleting this issued book data ?"}/></TableCell>
                        </TableRow>
                      ))
                    }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}