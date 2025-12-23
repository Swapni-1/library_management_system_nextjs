"use client"
import { useCategoryStore } from "@/app/_hooks/useCategory"
import BookItem from "./BookItem";
import { useEffect, useState } from "react";
import {useSearchParams} from "next/navigation"
import axios from "axios";
import useSWR from "swr";
import { useMutateBook } from "@/app/_hooks/useMutateBook"

export default function BookList(){

    const {name} = useCategoryStore();
    const params = useSearchParams();
    const {setMutateBook} = useMutateBook();
    // const [bookData,setBookData] = useState([]);

    const {data : bookData,mutate : bookDataMutate} = useSWR(`/api/book/${params.get("category") || "all"}`,(url : string) => axios.get(url).then(({data}) => data)) ;
    console.log(bookData);

    useEffect(() => {
        setMutateBook(bookDataMutate)
    },[params])


    return (
        <div className="p-5">
            <div>
                <h1 className="text-2xl font-medium "><span>#</span> {name || "All"} books</h1>
                <h2 className="text-primary/80 text-xl font-semibold">{bookData && bookData.length} books found</h2>
            </div>
            <div className="mt-3 grid grid-cols-[repeat(5,1fr)] gap-x-5 gap-y-5">
                {
                    bookData && bookData.map((book) => (
                        <BookItem key={book.book_id} book={book}/>
                    ))
                }
            </div>
        </div>
    )
}