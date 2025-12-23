"use client"
import Image from "next/image";
import {LogOut} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import { useSearchParams} from "next/navigation";
import clsx from "clsx";
import AddBook from "./AddBook";
import AddStudent from "./AddStudent";
import { useSidebarStore } from "@/app/_hooks/useSelect";
import {useMutateBook} from "@/app/_hooks/useMutateBook";
import {useMutateStudent} from "@/app/_hooks/useMutateStudent"
import {signOut} from "next-auth/react"
import { Bounce, toast } from "react-toastify";



export default function Header(){


    const router = useRouter();
    const params = useSearchParams();
    const {setSelectedName} = useSidebarStore();
    const {mutateBook} = useMutateBook();
    const {mutateStudent} = useMutateStudent();

    function handleLogout(){
        signOut()
        .then(() => {
            toast.success('Logged out successfully', {
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
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            router.refresh();
        })
    }

    return (
        
        <div className="w-full h-[5rem] flex justify-between shadow-md">
            <div className="flex gap-2 p-5 cursor-pointer" onClick={() => router.push("/")}>
                <h1 className="text-2xl">Library Management System</h1>
                <Image src={"/lms.png"} alt="logo" width={40} height={40}/>
            </div>
                {/* {
                    !params.has("bookId") && 
                    <SearchBar placeholder={"Search Books"}/>
                } */}
                
            <div className={clsx(`p-5 flex gap-3 ml-[30rem]`)}>
                {
                    params.has("bookId") ?
                    <AddStudent mutate={mutateStudent} className/>
                    :
                    <AddBook mutate={mutateBook} selectedName className/>
                }
                <Button onClick={() => {
                    router.push("/dashboard");
                    setSelectedName("");
                }}
                >Dashboard</Button>
            </div>
            <div className="p-5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src="https://cdn-icons-png.flaticon.com/512/1999/1999625.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30">
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                        <LogOut/>
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </div>
            
    )
}