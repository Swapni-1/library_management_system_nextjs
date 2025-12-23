import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SearchBar from "@/app/_components/Search"
import axios from "axios"
import AddCategory from "@/app/_components/AddCategory"
import UpdateCategory from "@/app/dashboard/update/UpdateCategory"
import DeleteDialogButton from "@/app/_components/DeleteDialogButton"
import useSWR from "swr"

export default function Category({selectedName}){


    const {data : categoryData,mutate} = useSWR("/api/category",(url : string) => axios.get(url).then(({data}) => data));

    return (
        <div  className="w-full relative">
            <div className="text-2xl font-medium p-2 text-center">All Students Data</div>
            <AddCategory mutate={mutate} className={"absolute right-0 top-0"}/>
            {/* <div className="absolute -top-5 left-0">
                <SearchBar placeholder={"Search Category"}/>
            </div> */}
            <div className="p-2 mt-3 border border-gray-500 rounded-md">
                <Table>
                    <TableCaption className="text-black text-xl">{categoryData && categoryData.length === 0 && "No category data found."}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial no.</TableHead>
                        <TableHead>Category name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody >
                        {
                            categoryData && categoryData.map((category,index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>
                                        <UpdateCategory mutate={mutate} categoryId={category.category_id} categoryData={category} className={"bg-green-500 hover:bg-green-500/90"} disabled={category.name === "All" && true}/>
                                    </TableCell>
                                    <TableCell>
                                        <DeleteDialogButton mutate={mutate} deleteType={"category"} deleteId={category.category_id} title={"Are you sure about deleting this category ?"} disabled={category.name === "All" && true}/>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                      
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}