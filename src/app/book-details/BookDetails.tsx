"use client"
import { useSearchParams } from "next/navigation"
import { useEffect,useState } from "react";
import axios from "axios";
import Image from "next/image";
import {date} from "@/lib/date"
import { Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"
import SearchBar from "../_components/Search";
import IssueBook from "./IssueBook";
import ReturnBook from "./ReturnBook";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import {checkBookAvailable} from "@/lib/libraryValidation";
import {useMutateStudent} from "@/app/_hooks/useMutateStudent"

export default function BookDetails(){
    const params = useSearchParams();
    const bookId = params.get("bookId");
    const [bookData,setBookData] = useState({});
    const [availableBook,setAvailableBook] = useState(0);

    const {setMutateStudent} = useMutateStudent();

    const {data : bookIssuedData,mutate : bookIssuedMutate} = useSWR("/api/book-issue/"+bookId,(url) => axios.get(url).then(({data}) => data));
    const {data : bookReturnedData,mutate : bookReturnedMutate} = useSWR("/api/book-return/"+bookId,(url) => axios.get(url).then(({data}) => data));
    const {data : studentData,mutate : studentDataMutate} = useSWR("/api/student",(url) => axios.get(url).then(({data}) => data))


    useEffect(() => {
        getBookDetails(params.get("bookId") as string)
        setMutateStudent(studentDataMutate)
        checkBookAvailable(params.get("bookId") as string)
        .then((data) => setAvailableBook(data))
        .catch((error) => console.log(error))
    },[params,bookIssuedData,bookReturnedData])

    function getBookDetails(bookId : string){
        axios.get("/api/book/"+bookId)
        .then(({data}) => {
            if(data.length){
                // console.log(true)
                setBookData(data[0])
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <div>
            <div className="w-full h-full flex justify-between p-5 gap-2">
                {/* Book Image  */}
                <div className="w-1/5 h-full flex flex-col items-center gap-2">
                    {
                        bookData.bookImg && 
                        <Image 
                        src={bookData?.bookImg}
                        alt={bookData?.name}
                        width={200}
                        height={200}
                        className="cursor-pointer"
                    />
                    }
                    
                    {/* availability  */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl">Available Books : {availableBook}</h1>
                        <h1 className="text-xl">Total Books : {bookData.total_quantity}</h1>
                    </div>
                </div>
    
                {/* Book Details  */}
                <div className="w-3/5 flex flex-col p-2 gap-2">
                    {/* name  */}
                    <div className="">
                        <h1 className="text-2xl text-primary underline">{bookData.name}</h1>
                    </div>

                    {/* released*/}
                    <div>
                        {
                            bookData.published_year &&
                            <p>| Released : {date(bookData.published_year)}</p>
                        }
                    </div>

                    {/* publisher  */}
                    <div>
                        <p>publisher : {bookData.publisher}</p>
                    </div>

                    {/* price */}

                    <div>
                        <p>price : ₹{bookData.price}</p>
                    </div>

                    {/* description  */}

                    <div>
                        <h1 className="text-xl underline">About</h1>
                        <p className="text-sm">{bookData.description}</p>
                    </div>
    
                </div>
    
                {/* Book Issue & return  */}
                <div className="w-1/5  flex flex-col justify-center gap-10 border border-gray-300 rounded-md p-3">
                    { 
                        availableBook < 1 ?
                        <Button disabled variant={"destructive"}>No books available</Button>
                        :
                        studentData && bookIssuedData && <IssueBook mutate={bookIssuedMutate} studentData={studentData}/>
                    }
                    {
                         studentData && bookIssuedData && 
                         <ReturnBook mutate={bookReturnedMutate} studentData={studentData}/>
                    }
                </div>
            </div>

            {/* Books Records */}

            <div className="w-full  p-5 mt-3">
                <div className="text-center">
                    <h1 className="text-2xl underline">Book Record</h1>
                </div>

                <div className="flex border mt-3">
                    {/* book issued record  */}
                    <div className="flex-1 relative">
                        {/* heading  */}
                        <div className="flex justify-center">
                            <h1 className="text-xl">Issued list</h1>
                        </div>

                        {/* <div className="absolute -top-5 left-0">
                            <SearchBar placeholder={"Search issued list"}/>
                        </div> */}

                        {/* issued data  */}
                        <div className="mt-3 overflow-auto max-h-[30rem]">
                            <Table>
                              <TableCaption className="text-black text-lg">{bookIssuedData && bookIssuedData.length === 0 && "No book issued list found."}</TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student ID</TableHead>
                                  <TableHead>Student name</TableHead>
                                  <TableHead>Issued date</TableHead>
                                  <TableHead>Due date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                    bookIssuedData && bookIssuedData.map((bookIssue,index) => (
                                        <TableRow key={index}>
                                          <TableCell>{bookIssue.student[0].student_id}</TableCell>
                                          <TableCell>{bookIssue.student[0].name}</TableCell>
                                          <TableCell>{date(bookIssue.issueDate)}</TableCell>
                                          <TableCell>{date(bookIssue.dueDate)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                              </TableBody>
                            </Table>
                        </div>
                    </div>
                    {/* Seperator  */}
                    <div className="border border-gray-300/80"></div>
                    {/* book returned record  */}
                    <div className="flex-1 relative">
                        {/* heading  */}
                        <div className="flex justify-center">
                            <h1 className="text-xl">Returned list</h1>
                        </div>

                        {/* SearchBar  */}
                        {/* <div className="absolute -top-5 left-0">
                            <SearchBar placeholder={"Search returned list"}/>
                        </div> */}

                        {/* return data  */}
                        <div className="mt-3 max-h-[30rem]">
                            <Table>
                            <TableCaption className="text-black text-lg">{ bookReturnedData && bookReturnedData.length === 0 && "No book returned list found."}</TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student ID</TableHead>
                                  <TableHead>Student name</TableHead>
                                  <TableHead>Returned date</TableHead>
                                  <TableHead>Due date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {
                                    bookReturnedData && bookReturnedData.map((bookReturn,index) => (
                                        <TableRow key={index}>
                                          <TableCell>{bookReturn.student[0].student_id}</TableCell>
                                          <TableCell>{bookReturn.student[0].name}</TableCell>
                                          <TableCell>{date(bookReturn.returnDate)}</TableCell>
                                          <TableCell>{date(bookReturn.dueDate)}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                
                              </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}