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
import { useSearchParams } from "next/navigation"
import { toast,Bounce } from "react-toastify"
import { bookIssueValidation } from "@/lib/libraryValidation"

const issueBookSchema = z.object({
    studentId : z.string({required_error : "please select a student id"}),
    issueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
    dueDate : z.string().regex(/[TZ.\-:]/,{message : "date cannot be empty"}).transform((val) => new Date(val).toISOString()),
  })
  .refine(({issueDate,dueDate}) => new Date(dueDate) > new Date(issueDate),{
    message : "Due date must be greater than issue date",
    path : ["dueDate"]
  })
  .refine(({ issueDate }) => new Date(issueDate) <= new Date(), {
    message: "Issue date cannot be in the future",
    path: ["issueDate"],
});

export default function IssueBook({className,studentData,mutate}){

    const [studentDataOptions,setStudentDataOptions] = useState([]);
    const [studentId,setStudentId] = useState("");
    const [open,setOpen] = useState(false);
    const [studentOpen,setStudentOpen] = useState(false);
    // const [limit,setLimit] = useState("false");
    // const [issueVal,setIssueVal] = useState(false);

    const params =useSearchParams();

    useEffect(() => {
      const studentOptions : Option[] = [];

      // if(studentId !== ""){
          // checkBookIssueLimit(studentId)
          // .then((data) => setLimit(data))
          // .catch((error) => console.log(error));

          // bookIssueValidation(studentId,params.get("bookId") as string)
          // .then((data) => data <= 0 ? setIssueVal(false) : setIssueVal(true))
          // .catch((error) => console.log(error))

          // if(limit){
          //   closeDialog();
          //   toast('student cannot issue more than 2 books', {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "light",
          //     transition: Bounce,
          //     });
          // }

      //     if(issueVal || issueVal && limit){
      //       closeDialog()
      //       toast.error('book is already issued', {
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
      // }

      studentData.map((student : object) => {
        studentOptions.push({label : `${student.student_id} ${student.name}`,value : student.student_id})
        setStudentDataOptions([...studentOptions]);
      })
    },[studentData])


    useEffect(() => {
      bookIssueValidation(studentId,params.get("bookId") as string)
      .then((data) => {
        const {canIssue,message} = data;
        console.log(data);
        if(!canIssue){
            closeDialog()
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
      .catch(error => error);
    },[studentId])

    const form = useForm<z.infer<typeof issueBookSchema>>({
      resolver: zodResolver(issueBookSchema),
      defaultValues : {
        studentId : "",
        issueDate : "",
        dueDate : ""
      }
    })

    function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        if(!isOpen){
          form.reset();
          setStudentId("");
        }
    }

    function closeDialog(){
      setOpen(false);
      form.reset();
      setStudentId("");
    }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof issueBookSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        const data = {bookId : params.get("bookId"),studentId : values.studentId,issueDate : values.issueDate,dueDate : values.dueDate}

        axios.post("/api/book-issue",data)
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success('successfully book issued', {
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
                    <Button className={className}>Issue book</Button>
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
                                    <FormLabel>Issue date</FormLabel>
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