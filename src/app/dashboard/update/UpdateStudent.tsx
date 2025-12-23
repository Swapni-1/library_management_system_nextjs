import { Dialog,DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {semester,course_name as courseData} from "@/app/dashboard/data"
import { Bounce, toast } from "react-toastify"
import axios from "axios"

const studentSchema = z.object({
    studentId: z.string({required_error : "student id cannot be empty"}).min(4,"Enter at least 4 digit book id"), // Integer for the book ID
    name: z.string({required_error : "student name cannot be empty"}).min(3, "Name must be at least 3 character"), // Non-empty string
    fathers_name : z.string({required_error : "father's name cannot be empty"}).min(3,"father's name must be at least 3 character"),
    course_name : z.string({required_error : "Please select course name to display"}),
    course_type : z.string({required_error : "Please select course type to display"}),
    year : z.string({required_error : "Please select year to display"})
  });

export default function UpdateStudent({className,studentId,mutate,studentData}){

    const [courseType,setCourseType] = useState("");
    const [open,setOpen] = useState(false);
    const {student_id,name,father_name,course_name,course_type,year} = studentData;

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
      form.setValue("studentId",student_id);
      form.setValue("name",name);
      form.setValue("fathers_name",father_name);
      form.setValue("course_name",course_name);
      form.setValue("course_type",course_type);
      form.setValue("year",year);
      if(!isOpen){
        form.reset();
      }
    }

    function closeDialog(){
      form.reset();
      setOpen(false);
    }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof studentSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        if(student_id === values.studentId && values.name === name && values.fathers_name === father_name && values.course_name === course_name && values.course_type === course_type && values.year === year){
          closeDialog();
          toast.info('no changes has made', {
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
          axios.put("/api/student/"+studentId,{
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
            toast.success('student is updated successfully', {
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
            // router.prefetch("/dashboard/student")
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
                      <DialogTitle className="text-center">Update the student</DialogTitle>
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
                                      <Input disabled placeholder="A123F" className="border border-gray-500" type="text" {...field} />
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
                                          <SelectValue placeholder={field.value}/>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {
                                          courseData.map((course,index) => (
                                            <SelectItem key={index} value={course}>{course}</SelectItem>
                                          ))
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
                                        <SelectValue placeholder={field.value}/>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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