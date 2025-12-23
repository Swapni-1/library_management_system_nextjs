import {auth} from "@/auth"
import Authentication from "../_components/Authentication";
import Dashboard from "./Dashboard";


export default async function Home(){

    const session = await auth();

    if(!session?.user) return <Authentication/>
    return (
        <div className="w-full">
            <Dashboard/>
        </div>
    )
}