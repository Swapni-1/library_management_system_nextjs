import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import SearchBar from "@/app/_components/Search"
import ReturnBook from "@/app/_components/ReturnBook";
import { useEffect, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import UpdateReturnedBook from "@/app/dashboard/update/updateReturnedBook";
import DeleteDialogButton from "@/app/_components/DeleteDialogButton";
import useSWR from "swr";
import { date } from "@/lib/date";
import {differenceInDays} from "date-fns"
import { Bounce, toast } from "react-toastify"


export default function IssuedBook({selectedName}){

    const {data : returnedBookData,mutate} = useSWR("/api/book-return",(url) => axios.get(url).then(({data}) => data))

    const [bookData,setBookData] = useState([]);
    const [studentData,setStudentData] = useState([]);

    useEffect(() => {
      getBookData();
      getStudentData();
    },[selectedName,returnedBookData])

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

    function handlePaid(val,return_id){
      // console.log(val)
      axios.put("/api/fine-paid/"+return_id,{
        paid : val,
      })
      .then(({data}) => {
        console.log(data);
        mutate();
        if(val === "PAID"){
          toast.success("student fine paid successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }

    return (
        <div  className="w-full relative">
            <div className="text-2xl font-medium p-2 text-center">All Returned Book Data</div>
            <ReturnBook mutate={mutate} bookData={bookData} studentData={studentData} className={"absolute right-0 top-0"}/>
            {/* <div className="absolute -top-5 left-0">
                <SearchBar placeholder={"Search Issued book"}/>
            </div> */}
            <div className="p-2 mt-3 border border-gray-500 rounded-md">
                <Table>
                    <TableCaption className="text-xl text-black">{returnedBookData && returnedBookData.length === 0 && "No issued book data found."}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial no.</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>BookName</TableHead>
                        <TableHead>Returned Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Overdue By</TableHead>
                        <TableHead>Fine On Overdue</TableHead>
                        <TableHead>Fine</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody >
                    {
                      returnedBookData && returnedBookData.map((returnedBook,index) => (
                        <TableRow key={index}>
                          <TableCell>{index+1}</TableCell>
                          <TableCell>{returnedBook.student[0].name}</TableCell>
                          <TableCell>{returnedBook.book[0].name.length > 15 ?returnedBook.book[0].name.slice(0,15)+"..." : returnedBook.book[0].name}</TableCell>
                          <TableCell>{date(returnedBook.returnDate)}</TableCell>
                          <TableCell>{date(returnedBook.dueDate)}</TableCell>
                          <TableCell>{returnedBook.returnDate > returnedBook.dueDate ? differenceInDays(returnedBook.returnDate,returnedBook.dueDate) : 0} days</TableCell>
                          <TableCell>Rs. {returnedBook.returnDate > returnedBook.dueDate ? differenceInDays(returnedBook.returnDate,returnedBook.dueDate) * 5 : 0}</TableCell>
                          <TableCell>{returnedBook.returnDate > returnedBook.dueDate ? (
                            <Select onValueChange={(val) => handlePaid(val,returnedBook.return_id)} defaultValue={returnedBook.paid}>
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder={""} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Paid ?</SelectLabel>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="NOT_PAID">Not Paid</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          ) : "no need"}</TableCell>
                          <TableCell><UpdateReturnedBook returnedBookData={returnedBook} returnedBookId={returnedBook.return_id} mutate={mutate} bookData={bookData} studentData={studentData} className={"bg-green-500 hover:bg-green-500/90"}/></TableCell>
                          <TableCell><DeleteDialogButton deleteType={"returned-book"} mutate={mutate} disabled={false} deleteId={returnedBook.return_id} title={"Are you sure about deleting this issued book data ?"}/></TableCell>
                        </TableRow>
                      ))
                    }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}