"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function BookItem({book}){
    
    const router = useRouter();
    
    function handleBook(){
        router.push("/book-details/?bookId="+book.book_id)
    }
    return (
        <div onClick={handleBook} className="border border-primary cursor-pointer rounded-md hover:bg-primary/40 transition-all duration-100 ease-in-out">
            <div className="p-2">
                <Image 
                    src={book.bookImg}
                    alt={book.name}
                    height={80}
                    width={80}
                    className="w-full h-[20rem] rounded-md object-fill"
                />
                <h1 className="text-center text-medium">{book.name}</h1>
            </div>
            <div className="pb-2 text-center text-medium">
                <h1>{book.publisher}</h1>
                <h1>Rs. {book.price}</h1>
            </div>
        </div>
    )
}