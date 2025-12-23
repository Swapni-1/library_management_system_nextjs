import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList } from "@/components/ui/command"
import axios from "axios"
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover"
import { Option } from "@/components/ui/multiple-selector";
import { toast,Bounce } from "react-toastify"
import { bookIssueValidation, checkBookAvailable, checkBookIssueLimit } from "@/lib/libraryValidation"
import { date } from "@/lib/date"

const issueBookSchema = z.object({
    studentId : z.string({required_error : "please select a student id"}), // Integer for the book ID
    bookId : z.string({required_error : "please select a book id"}),
    issueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
    dueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  });

export default function IssueBook({className,issuedBookData,mutate,issuedBookId}){

    const [open,setOpen] = useState(false);

    const form = useForm<z.infer<typeof issueBookSchema>>({
      resolver: zodResolver(issueBookSchema),
      defaultValues : {
        studentId : issuedBookData.student[0].student_id,
        bookId : issuedBookData.book[0].book_id,
        issueDate : issuedBookData.issueDate,
        dueDate : issuedBookData.dueDate
      }
    })

    function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        form.setValue("studentId",issuedBookData.student[0].student_id)
        form.setValue("bookId",issuedBookData.book[0].book_id)
        form.setValue("issueDate",issuedBookData.issueDate.split("T")[0])
        form.setValue("dueDate",issuedBookData.dueDate.split("T")[0])
        if(!isOpen){
          form.reset();
        }
    }

    function closeDialog(){
      setOpen(false);
      form.reset();
    }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof issueBookSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const data = {issue_id : issuedBookData.issue_id,book_id : values.bookId,student_id : values.studentId,issueDate : values.issueDate,dueDate : values.dueDate};
        if(values.dueDate === issuedBookData.dueDate){
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
        axios.put("/api/book-issue/"+issuedBookId,data)
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success("issued book updated successfully", {
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
                      <DialogTitle className="text-center">Issue a new book</DialogTitle>
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
                                        <Input disabled type="text" className="border border-gray-500" {...field}/>
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
                                        <Input disabled type="text" className="border border-gray-500" {...field}/>
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
                                    <FormLabel>Issue date</FormLabel>
                                    <FormControl>
                                        <Input disabled type="date" className="border border-gray-500" {...field}/>
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
                                        <Input type="date" className="border border-gray-500" {...field}/>
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