"use client"
import axios from "axios"
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect,useRef,useState } from "react";
import clsx from "clsx";
import { useCategoryStore } from "@/app/_hooks/useCategory"
import useSWR from "swr";



export default function Categories(){

    const [selectedCategory,setSelectedCategory] = useState("all");
    const [isScrollRight,setIsScrollRight] = useState(false);
    const listRef = useRef(null);
    const {setName} = useCategoryStore();

    const params = useSearchParams();

    const {data : categoryData } = useSWR("/api/category",(url) => axios.get(url).then(({data}) => data));

    useEffect(() => {
            
            if(categoryData){
                categoryData.forEach((item) => {
                if(item.slug === params.get("category")){
                    setName(item.name);
                }
            })
        }
            
    },[params])

    const ScrollRightHandler = () => {
        setIsScrollRight(true);
        if(listRef.current){
            listRef.current.scrollBy({
                left : 200,
                behavior : "smooth"
            })
        }
    }

    const ScrollLeftHandler = () => {
        if(listRef.current){
            if(listRef.current.scrollLeft < 200){
                setIsScrollRight(false);
            }
            listRef.current.scrollBy({
                left : -200,
                behavior : "smooth"
            })
        }
    }

    return (
        <div className="mt-3 p-5 relative">
            <h2 className="text-2xl font-medium">Categories</h2>
            {
                isScrollRight &&
                <ArrowLeftCircle onClick={ScrollLeftHandler} className="absolute top-[4.7rem] left-0 cursor-pointer bg-gray-400 text-white rounded-full" size={28}/>
            }
            <div className="mt-2 flex gap-6 overflow-auto scrollbar-hide" ref={listRef}>
                
                {
                    categoryData && categoryData.map((category) => (
                        <Link href={"?category="+category.slug} key={category.category_id} className={clsx("flex justify-center items-center border border-primary rounded-md cursor-pointer px-8 py-1 hover:bg-primary/30",category.slug === (params.get("category") ? params.get("category") : selectedCategory) && "bg-primary hover:bg-primary/90 hover:text-black text-white")}>
                                <h1>{category.name}</h1>
                        </Link>
                    ))
                }
                
            </div>
            <ArrowRightCircle onClick={ScrollRightHandler} className="absolute top-[4.7rem] right-0 cursor-pointer bg-gray-400 rounded-full text-white" size={28}/>
        </div>
    )
}