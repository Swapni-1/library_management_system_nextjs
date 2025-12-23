"use client"
import Sidebar from "../Sidebar"
import ReturnedBook from "./ReturnedBook";
import clsx from "clsx";
import { useSidebarStore } from "@/app/_hooks/useSelect";

export default function Home(){
    const {selectedName} = useSidebarStore();
    return (
        <div className="w-full flex">
            {/* sidebar  */}
            <Sidebar/>
            <div className={clsx("p-5 w-4/5 bg-cover")}>
                <ReturnedBook selectedName={selectedName}/>
            </div>
        </div>
    )
}