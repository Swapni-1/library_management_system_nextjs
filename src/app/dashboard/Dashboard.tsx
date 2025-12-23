"use client"
import Sidebar from "./Sidebar"
import clsx from "clsx";

export default function Dashboard(){
    
    return (
        <div className="w-full flex">
            {/* sidebar  */}
            <Sidebar/>
            <div className={clsx("p-5 w-4/5 bg-cover",`bg-[url("https://images.unsplash.com/photo-1522211988038-6fcbb8c12c7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")]`)}>
                
                    <div className="w-full flex flex-col gap-3 bg-white rounded-md">
                        <div className="w-full">
                            <h1 className="text-center text-2xl font-medium">Welcome to the Dashboard</h1>
                        </div>
                        <div>
                            <p className="text-center text-xl">Here you can easily manage your library.</p>
                        </div>
                    </div>
            </div>
        </div>
    )
}