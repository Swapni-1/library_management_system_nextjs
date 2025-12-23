import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {semester,year,course_name as courseData} from "@/app/dashboard/data"
import axios from "axios"
import { Bounce, toast } from "react-toastify"
import { isStudentExists } from "@/lib/libraryValidation"
// import { useRouter } from "next/navigation"

const studentSchema = z.object({
    studentId: z.string({required_error : "student id cannot be empty"}).min(4,"Enter at least 4 digit book id"), // Integer for the book ID
    name: z.string({required_error : "student name cannot be empty"}).min(3, "Name must be at least 3 character"), // Non-empty string
    fathers_name : z.string({required_error : "father's name cannot be empty"}).min(3,"father's name must be at least 3 character"),
    course_name : z.string({required_error : "Please select course name to display"}),
    course_type : z.string({required_error : "Please select course type to display"}),
    year : z.string({required_error : "Please select year to display"})
  });

export default function AddStudent({className,mutate}){

    const [courseType,setCourseType] = useState("");
    const [open,setOpen] = useState(false);
    const form = useForm<z.infer<typeof studentSchema>>({
        resolver: zodResolver(studentSchema),
        defaultValues : {
          studentId : "",
          name : "",
          fathers_name : "",
          course_name : "",
          course_type : "",
          year : ""
        }
      })


    function onCourseTypeChange(fieldOnChange){
      return (value) => {
        setCourseType(value);
        fieldOnChange(value);
        console.log(value);
      }
    }

    function handleDialogChange(isOpen : boolean){
      setOpen(isOpen);
      if(!isOpen){
        form.reset();
      }
    }

    function closeDialog(){
      setOpen(false);
      form.reset();
    }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof studentSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        isStudentExists(values.studentId)
        .then((data) => {
          if(data){
            closeDialog();
            toast.error('student id is already exists', {
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
            axios.post("/api/student",{
              student_id : values.studentId,
              student_name :values.name,
              father_name : values.fathers_name,
              course_name :values.course_name,
              course_type : values.course_type,
              year : values.year,
            })
            .then(({data}) => {
              console.log(data);
              mutate();
              toast.success('student is successfully added', {
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
        })
        .catch((error) => console.log(error));

        
      }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button className={className}>Add Student</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">Add a new student</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center overflow-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide">
                              <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Student id</FormLabel>
                                    <FormControl>
                                      <Input placeholder="A123F" className="border border-gray-500" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Student name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John Doe" className="border border-gray-500" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="fathers_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Father&apos;s name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mike Doe" className="border border-gray-500" type="text" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="course_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Course Name</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="border border-gray-500">
                                          <SelectValue placeholder={"Select a course name to display"}/>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {
                                          courseData.map((course : string,index : number) => 
                                            <SelectItem key={index} value={course}>{course}</SelectItem>
                                          )   
                                        }
                                      </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="course_type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Course type</FormLabel>
                                    <Select onValueChange={onCourseTypeChange(field.onChange)} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="border border-gray-500">
                                        <SelectValue placeholder={"Select a course type to display"}/>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="YEAR">YEAR</SelectItem>
                                      <SelectItem value="SEMESTER">SEMESTER</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={courseType !== "YEAR" && courseType !== "SEMESTER" ? true : false}>
                                    <FormControl>
                                      <SelectTrigger className="border border-gray-500">
                                        <SelectValue placeholder={`Select ${courseType !== "" && courseType === "YEAR" ? "YEAR" : "SEMESTER"} to display`} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {
                                          courseType !== "" && courseType === "YEAR" ?
                                          (
                                            year.map((item,index) => (
                                              <SelectItem key={index} value={item}>{item}</SelectItem>
                                            ))
                                          )
                                          :
                                          (
                                            semester.map((item,index) => (
                                              <SelectItem key={index} value={item}>{item}</SelectItem>
                                            ))
                                          )
                                      }
                                    </SelectContent>
                                    </Select>
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