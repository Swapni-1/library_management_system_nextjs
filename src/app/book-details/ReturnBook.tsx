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
import axios from "axios"
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover"
import { Option } from "@/components/ui/multiple-selector";
import { useEffect } from "react"
import {useSearchParams} from "next/navigation"
import { toast,Bounce } from "react-toastify"
import { bookReturnValidation } from "@/lib/libraryValidation"

const returnBookSchema = z.object({
    studentId : z.string().min(4,"Enter at least 4 digit student id"), // Integer for the book ID
    issueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
    returnDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
    dueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  }).refine(({issueDate,returnDate}) => returnDate >= issueDate,{
    message : "return date cannot be less than issue date",
    path : ["returnDate"]
  }) ;

export default function ReturnBook({className,studentData,mutate}){

  const [studentDataOptions,setStudentDataOptions] = useState([]);
  const [studentId,setStudentId] = useState("");
  const [issueId,setIssueId] = useState("");
  const [issueDate,setIssueDate] = useState("");
  const [dueDate,setDueDate] = useState("");
  const [open,setOpen] = useState(false);
  const [studentOpen,setStudentOpen] = useState(false);

  const params =useSearchParams();

    useEffect(() => {
      const studentOptions : Option[] = [];
      
      // if(studentId !== ""){
      //   getStudentById(studentId);
      //   bookReturnValidation(studentId,params.get("bookId") as string)
      //   .then((data) => {
      //     if(data <= 0){
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
        form.setValue("issueDate",issueDate.split("T")[0])
        // form.setValue("dueDate",dueDate.split("T")[0])
      }

      if(dueDate !== ""){
        // form.setValue("issueDate",issueDate.split("T")[0])
        form.setValue("dueDate",dueDate.split("T")[0])
      }

      studentData.map((student : object) => {
        studentOptions.push({label : `${student.student_id} ${student.name}`,value : student.student_id})
        setStudentDataOptions([...studentOptions]);
      })
  
    },[studentData,studentId,issueDate,dueDate])


    useEffect(() => {
      if(studentId !== ""){
        getStudentById(studentId);
        bookReturnValidation(studentId,params.get("bookId") as string)
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
    },[studentId]);

    function getStudentById(id : string){
      axios.get("/api/student/"+id)
      .then(({data}) => {
        const {bookIssue} = data;
        const issuedBook = bookIssue.filter((issue) => issue.book[0].book_id === params.get("bookId") as string)
        setIssueId(issuedBook[issuedBook.length - 1].issue_id);
        setIssueDate(issuedBook[issuedBook.length - 1].issueDate.split("T")[0]);
        setDueDate(issuedBook[issuedBook.length - 1].dueDate.split("T")[0]);
        // console.log(bookIssue);
      }) 
      .catch((error) => {
        console.log(error);
      })
    }

    const form = useForm<z.infer<typeof returnBookSchema>>({
        resolver: zodResolver(returnBookSchema),
        defaultValues : {
          studentId : "",
          issueDate : new Date().toISOString(),
          returnDate : "",
          dueDate : new Date().toISOString(),
        }
      })

      function handleDialogChange(isOpen : boolean){
          setOpen(isOpen);
          if(!isOpen){
            setStudentId("");
            setIssueDate("");
            setDueDate("");
            form.reset();
          }
      }

      function closeDialog(){
        setOpen(false);
        setStudentId("");
        setIssueDate("");
        setDueDate("");
        form.reset();
      }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof returnBookSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const returnBookData = {issueId,bookId : params.get("bookId"),studentId : values.studentId,returnDate : values.returnDate,dueDate : values.dueDate}

        axios.post("/api/book-return",returnBookData)
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success('successfully book returned', {
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
        .catch((error) => console.log(error))
        .finally(() => closeDialog());
        // console.log(values)
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
                                      {studentDataOptions.map((student,index) => (
                                        <CommandItem
                                          value={student.label}
                                          key={index}
                                          onSelect={() => {
                                            setStudentId("");
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
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issued date</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly type="date" className="border border-gray-500" />
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
                                <Input type="date" readOnly={studentId !== "" ? false : true} className="border border-gray-500" {...field}/>
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
                                <Input {...field} readOnly type="date" className="border border-gray-500" />
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
