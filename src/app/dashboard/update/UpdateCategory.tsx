import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bounce, toast } from "react-toastify"
import { useState } from "react"
import axios from "axios"

const categorySchema = z.object({
    // studentId: z.string().min(4,"Enter at least 4 digit book id"), // Integer for the book ID
    name: z.string().min(3, "Name must be at least 3 character"), // Non-empty string
    });

export default function UpdateCategory({mutate,categoryId,categoryData,className,disabled}){
    
    const [open,setOpen] = useState(false);
    const {name} = categoryData;
    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues : {
          name :  name
        }
      })

      function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        form.setValue("name",name);
        if(!isOpen){
          form.reset();
        }
      }

      function closeDialog(){
        setOpen(false);
        form.reset();
      }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof categorySchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        if(values.name === name){
          toast.info("No changes has been made", {
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
            closeDialog();
        }
        else{
          axios.put("/api/category/"+categoryId,
            {
              category_name : values.name
            })
          .then(({data}) => {
            console.log(data);
            mutate();
            toast.success('category updated successful', {
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
                    <Button disabled={disabled} className={className}>Update</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">Update the category</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center overflow-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide">
              
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Sci-fi" className="border border-gray-500" type="text" {...field} />
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