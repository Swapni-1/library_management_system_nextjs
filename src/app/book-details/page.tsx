import Authentication from "../_components/Authentication";
import Header from "../_components/Header"
import BookDetails from "./BookDetails"
import { auth } from "@/auth"
export default async function Home(){
    const session = await auth();
    if(!session?.user) return <Authentication/>
    return (
        <div className="w-full">
            <Header/>
            <BookDetails/>
        </div>
    )
}