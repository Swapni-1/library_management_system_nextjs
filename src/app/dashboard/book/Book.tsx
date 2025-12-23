import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SearchBar from "@/app/_components/Search"
import AddBook from "@/app/_components/AddBook"
import { useEffect, useState } from "react"
import axios from "axios"
import { date } from "@/lib/date"
import UpdateBook from "@/app/dashboard/update/UpdateBook"
import DeleteDialogButton from "@/app/_components/DeleteDialogButton"
import useSWR, { mutate } from "swr"

export default function Book({selectedName}){

    const {data : bookData,mutate} = useSWR("/api/book",(url : string) => axios.get(url).then(({data}) => data))

    return (
        <div className="w-full relative">
            
            <div className="text-2xl font-medium p-2 text-center">All Books Data</div>
            <AddBook selectedName={selectedName} mutate={mutate} className={"absolute right-0 top-0"}/>
            {/* <div className="absolute -top-5 left-0">
                <SearchBar placeholder={"Search Books"}/>
            </div> */}
            <div className="p-2 mt-3 border border-gray-500 rounded-md">
                <Table>
                    <TableCaption className="text-black text-xl">{bookData && bookData.length === 0 && "No book data found."}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book id</TableHead>
                        <TableHead>Book Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Publisher</TableHead>
                        <TableHead>Published Year</TableHead>
                        <TableHead>ImageUrl</TableHead>
                        <TableHead>Total quantity</TableHead>
                        <TableHead>Categories</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody >
                      
                        {
                            bookData && bookData.map((book,index) => (
                                <TableRow key={index}>
                                    <TableCell>{book.book_id}</TableCell>
                                    <TableCell>{book.name.length > 15 ? `${book.name.slice(0,15)}...` : book.name}</TableCell>
                                    <TableCell>{book.description.length > 15 ? `${book.description.slice(0,15)}...` : book.description}</TableCell>
                                    <TableCell>{book.price}</TableCell>
                                    <TableCell>{book.publisher}</TableCell>
                                    <TableCell>{date(book.published_year)}</TableCell>
                                    <TableCell>{book.bookImg.length > 15 ? `${book.bookImg.slice(0,15)}...` : book.bookImg}</TableCell>
                                    <TableCell>{book.total_quantity}</TableCell>
                                    <TableCell>{book.category?.map((item,index) => (<p key={index}>{item.name}</p>))}</TableCell>
                                    <TableCell><UpdateBook mutate={mutate} bookId={book.book_id} bookData={book} selectedName={selectedName} className="bg-green-500 hover:bg-green-500/90"/></TableCell>
                                    <TableCell><DeleteDialogButton mutate={mutate} deleteId={book.book_id} deleteType={"book"} disabled={false} title={"Are you sure about deleting this book ?"}/></TableCell>
                                </TableRow>
                            ))
                        }
                      
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}