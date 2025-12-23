import { Dialog,DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList } from "@/components/ui/command"
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover"
import { Option } from "@/components/ui/multiple-selector";
import { useEffect } from "react"
import axios from "axios"
import { Bounce, toast } from "react-toastify"
import { bookReturnValidation } from "@/lib/libraryValidation"

const returnBookSchema = z.object({
  studentId : z.string().min(4,"Enter at least 4 digit student id"), // Integer for the book ID
  bookId : z.string().min(4,"Enter at least 4 digit student id"),
  issueId : z.string().min(4,"Enter at least 4 digit issue id"),
  issueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  returnDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  dueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
}).refine(({issueDate,returnDate}) => returnDate >= issueDate,{
  message : "return date cannot be less than issue date",
  path : ["returnDate"]
}) ;

export default function ReturnBook({className,bookData,studentData,returnedBookData,mutate,returnedBookId}){

  const [open,setOpen] = useState(false);
    
    const form = useForm<z.infer<typeof returnBookSchema>>({
      resolver: zodResolver(returnBookSchema),
      defaultValues : {
        studentId : returnedBookData.student[0].student_id,
        bookId : returnedBookData.book[0].book_id,
        issueId : returnedBookData.issue_id,
        issueDate : new Date().toISOString(),
        returnDate : returnedBookData.returnDate.split("T")[0],
        dueDate : returnedBookData.dueDate.split("T")[0],
      }
    })

      function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        form.setValue("studentId",returnedBookData.student[0].student_id)
        form.setValue("bookId",returnedBookData.book[0].book_id)
        form.setValue("issueId",returnedBookData.issue_id)
        form.setValue("returnDate",returnedBookData.returnDate.split("T")[0])
        form.setValue("dueDate",returnedBookData.dueDate.split("T")[0])
        getStudentById(returnedBookData.student[0].student_id,returnedBookData.book[0].book_id);
        if(!isOpen){
          form.reset();
        }
    }

    function closeDialog(){
      setOpen(false);
      form.reset();
    }

    function getStudentById(id : string,b_id : string){
      axios.get("/api/student/"+id)
      .then(({data}) => {
        const {bookIssue} = data;
        const issuedBook = bookIssue.filter((issue) => issue.book[0].book_id === b_id)
          // console.log(issuedBook);
          form.setValue("issueDate",issuedBook[issuedBook.length - 1].issueDate.split("T")[0]);
          // setDueDate(issuedBook[issuedBook.length - 1].dueDate);
        })
      .catch((error) => {
        console.log(error);
      })
    }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof returnBookSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const returnData = {issue_id : values.issueId,book_id : values.bookId,student_id : values.studentId,returnDate : values.returnDate,dueDate : values.dueDate}
        if(values.returnDate === returnedBookData.returnDate){
          closeDialog();
          toast.info("no changes has been made", {
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
        }else{
          axios.put("/api/book-return/"+returnedBookId,returnData)
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success("returned book updated successfully", {
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
          closeDialog();
        })
        }
      }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button className={className}>Update</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">Update the returned book</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center overflow-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide">
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Student Id</FormLabel>
                                    <FormControl>
                                        <Input type="text" disabled className="border border-gray-500" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="bookId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Book Id</FormLabel>
                                    <FormControl>
                                        <Input type="text" disabled className="border border-gray-500" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="issueId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Issue Id</FormLabel>
                                    <FormControl>
                                        <Input type="text" disabled placeholder="Issue Id" className="border border-gray-500" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Issue Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" disabled className="border border-gray-500" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="returnDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Return date</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="border border-gray-500" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Due date</FormLabel>
                                    <FormControl>
                                        <Input disabled type="date" className="border border-gray-500" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <Button type="submit">Submit</Button>
                            </form>
                        </Form>
                    </div>  
                  </DialogContent>
                </Dialog>
    )
}