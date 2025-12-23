import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useState } from "react"
import { Bounce, toast } from "react-toastify"

const categorySchema = z.object({
    // studentId: z.string().min(4,"Enter at least 4 digit book id"), // Integer for the book ID
    name: z.string().min(3, "Name must be at least 3 character"), // Non-empty string
    });

export default function AddCategory({className,mutate}){
    const [open,setOpen] = useState(false);

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues : {
          name : ""
        }
      })

      function handleDialogChange(isOpen : boolean){
        setOpen(isOpen)
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
        axios.post("/api/category",
          {
            category_name : values.name
          })
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success('new category added successful', {
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
        console.log(values)
      }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button className={className}>Add Category</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">Add a new category</DialogTitle>
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