"use client"
import { sidebarData } from "./data"
import clsx from "clsx"
import {useSidebarStore} from "@/app/_hooks/useSelect";
import { useEffect } from "react";
import {useRouter,usePathname} from "next/navigation"
import pascalcase from "pascalcase"


export default function Sidebar(){

    const {selectedName,setSelectedName} = useSidebarStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if(pathname.split("/").length === 3){
            if(/\-/.test(pathname.split("/")[2])){
                setSelectedName(pascalcase(pathname.split("/")[2].split("-")[0].toUpperCase())+" "+pathname.split("/")[2].split("-")[1].toLowerCase())
            }else{
                // setSelectedName(pathname.split("/")[2].toUpperCase());
                setSelectedName(pascalcase(pathname.split("/")[2]))
            }
        }else{
            setSelectedName("");
        }
    },[])
    
    useEffect(() => {
        // selectedName

        // console.log(pathname.split("/"));
        switch(selectedName){
            case "Home" : router.push("/")
            break;

            case "Book" : router.push("/dashboard/book")
            break;

            case "Student" : router.push("/dashboard/student")
            break;

            case "Category" : router.push("/dashboard/category")
            break;

            case "Issued book" : router.push("/dashboard/issued-book")
            break;

            case "Returned book" : router.push("/dashboard/returned-book")
            break;
            // default : router.push("/dashboard");
        }

        
    },[selectedName])

    function handleSideBarItem(name : string){
        setSelectedName(name);
    }

    return (
        <div className="w-1/5 h-[100vh] sticky left-0 top-0 p-5 list-none flex flex-col gap-3">
            
            {/* logo */}
            <li onClick={() => {
                router.push("/dashboard");
                setSelectedName("");
            }} 
                className="flex text-xl font-medium underline cursor-pointer text-primary">Library Management System</li>
             
             {
                sidebarData.map((item,index) => (
                    <li className={clsx("flex gap-3 cursor-pointer border p-2 hover:bg-primary/30 rounded-md",selectedName === item.name && "bg-primary/80 text-white hover:text-black hover:border hover:border-gray-500")} key={index} onClick={() => handleSideBarItem(item.name)}> {<item.icon/>} {item.name}</li>
                ))
             }
        </div>
    )
}