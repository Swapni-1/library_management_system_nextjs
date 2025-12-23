import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar({placeholder}){
    return (
        <div className="relative flex justify-center items-center p-5">
            <Search className="absolute top-7 right-7 cursor-pointer"/>
            <Input placeholder={placeholder} className="border border-black outline-none"/>
        </div>
    )
}