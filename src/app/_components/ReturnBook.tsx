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
  issueId : z.string().min(4,{message : "Enter at least 4 digit issue id"}),
  issueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  returnDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  dueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  fine : z.boolean()
}).refine(({issueDate,returnDate}) => returnDate >= issueDate,{
  message : "return date cannot be less than issue date",
  path : ["returnDate"]
}) ;

export default function ReturnBook({className,bookData,studentData,mutate}){

  const [bookDataOptions,setBookDataOptions] = useState([]);
  const [studentDataOptions,setStudentDataOptions] = useState([]);
  const [studentId,setStudentId] = useState("");
  const [bookId,setBookId] = useState("");
  const [issueDate,setIssueDate] = useState("");
  const [dueDate,setDueDate] = useState("");
  const [open,setOpen] = useState(false);
  const [studentOpen,setStudentOpen] = useState(false);
  const [bookOpen,setBookOpen] = useState(false); 
  const [issueId,setIssueId] = useState("");

    useEffect(() => {
      const bookOptions : Option[] = [];
      const studentOptions : Option[] = [];

      // if(studentId !== "" && bookId !== ""){
      //   console.log(studentId,bookId);
      //   getStudentById(studentId,bookId);
      //   bookReturnValidation(studentId,bookId)
      //   .then((data) => {
      //     console.log(data);
      //     if(!data){
      //       closeDialog();
      //       toast.error('book is not issued', {
      //         position: "top-right",
      //         autoClose: 2000,
      //         hideProgressBar: false,
      //         closeOnClick: true,
      //         pauseOnHover: true,
      //         draggable: true,
      //         progress: undefined,
      //         theme: "colored",
      //         transition: Bounce,
      //         });
      //     }
      //   })
      //   .catch((error) => console.log(error))
      // }

      if(issueDate !== ""){
        console.log(issueDate)
        form.setValue("issueDate",issueDate.split("T")[0])
      }

      if(dueDate !== ""){
        console.log(dueDate);
        form.setValue("dueDate",dueDate.split("T")[0])
      }

      if(issueId !== ""){
        console.log(issueId);
        form.setValue("issueId",issueId);
      }

      if(bookData){
        bookData.map((book : object) => {
          bookOptions.push({label : `${book.book_id} ${book.name.length > 30 ? book.name.slice(0,30) : book.name}`,value : book.book_id})
          setBookDataOptions([...bookOptions]);
        })
      }
      
      
  
      studentData.map((student : object) => {
        studentOptions.push({label : `${student.student_id} ${student.name}`,value : student.student_id})
        setStudentDataOptions([...studentOptions]);
      })
  
    },[bookData,studentData,issueDate,dueDate])

    useEffect(() => {
      if(studentId !== "" && bookId !== ""){
        getStudentById(studentId,bookId);
        bookReturnValidation(studentId,bookId)
        .then((data) => {
            const {canReturn,message} = data;
            console.log(data);
            if(!canReturn){
                closeDialog();
                toast.error(message, {
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
            }
        })
        .catch(error => console.log(error));
      }
    },[studentId,bookId])

    const form = useForm<z.infer<typeof returnBookSchema>>({
      resolver: zodResolver(returnBookSchema),
      defaultValues : {
        studentId : "",
        bookId : "",
        issueId : "",
        issueDate : new Date().toISOString(),
        returnDate : "",
        dueDate : new Date().toISOString(),
        fine : false
      }
    })

      function getStudentById(id : string,b_id : string){
        axios.get("/api/student/"+id)
        .then(({data}) => {
          const {bookIssue} = data;
          const issuedBook = bookIssue.filter((issue) => issue.book[0].book_id === b_id)
            // console.log(issuedBook);
            setIssueId(issuedBook[issuedBook.length -1].issue_id);
            setIssueDate(issuedBook[issuedBook.length - 1].issueDate);
            setDueDate(issuedBook[issuedBook.length - 1].dueDate);
          })
        .catch((error) => {
          console.log(error);
        })
      }

      function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        if(!isOpen){
          setStudentId("");
          setBookId("");
          setIssueDate("");
          setDueDate("");
          form.reset();
        }
    }

    function closeDialog(){
      setOpen(false);
      setStudentId("");
      setBookId("");
      setIssueDate("");
      setDueDate("");
      form.reset();
    }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof returnBookSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const returnBookdata = {issueId : values.issueId,bookId : values.bookId,studentId : values.studentId,returnDate : values.returnDate,dueDate : values.dueDate}
        axios.post("/api/book-return",returnBookdata)
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success("successfully book returned", {
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

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button className={className}>Return book</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">Return the issued book</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center overflow-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide">
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col gap-1">
                                    <FormLabel>Student name</FormLabel>
                                    <Popover open={studentOpen} onOpenChange={setStudentOpen}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              "justify-between border border-gray-500",
                                              !field.value && "text-muted-foreground"
                                            )}
                                          >
                                            {field.value
                                              ? studentDataOptions.find(
                                                  (student) => student.value === field.value
                                                )?.label
                                              : "Select student name"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="overflow-auto p-0 w-[350px]">
                                        <Command>
                                          <CommandInput placeholder="Search student name..." />
                                          <CommandList>
                                            <CommandEmpty>No student found.</CommandEmpty>
                                            <CommandGroup>
                                              {studentDataOptions.map((student) => (
                                                <CommandItem
                                                  value={student.label}
                                                  key={student.value}
                                                  onSelect={() => {
                                                    form.setValue("studentId", student.value);
                                                    setStudentId(student.value);
                                                    setStudentOpen(false);
                                                  }}
                                                >
                                                  {student.label}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                        student.value === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="bookId"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="">Book name</FormLabel>
                                    <Popover open={bookOpen} onOpenChange={setBookOpen}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              "justify-between border border-gray-500",
                                              !field.value && "text-muted-foreground"
                                            )}
                                          >
                                            {field.value
                                              ? bookDataOptions.find(
                                                  (book) => book.value === field.value
                                                )?.label
                                              : "Select book name"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="p-0 w-[350px]">
                                        <Command>
                                          <CommandInput placeholder="Search book name..." />
                                          <CommandList>
                                            <CommandEmpty>No book found.</CommandEmpty>
                                            <CommandGroup>
                                              {bookDataOptions.map((book) => (
                                                <CommandItem
                                                  value={book.label}
                                                  key={book.value}
                                                  onSelect={() => {
                                                    setBookId("");
                                                    form.setValue("bookId", book.value)
                                                    setBookId(book.value);
                                                    setBookOpen(false);
                                                  }}
                                                >
                                                  {book.label}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto",
                                                      book.value === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="issueId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Issued Id</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled type="text" placeholder="Issued Id" className="border border-gray-500" />
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
                                    <FormLabel>Issued date</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled type="date" className="border border-gray-500" />
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