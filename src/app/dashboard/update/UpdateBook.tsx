import { Dialog, DialogContent,DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import MultipleSelector,{Option} from "@/components/ui/multiple-selector"
import axios from "axios"
import { Bounce, toast } from "react-toastify"
import lodash from "lodash"


const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
  fixed : z.boolean().optional(),
});

const bookSchema = z.object({
    bookId: z.string().min(4,"Enter at least 4 digit book id"),
    name: z.string().min(3, "name must be at least 3 characters"),
    description: z.string().optional(), // Optional string
    price: z.string({required_error : "quantity cannot be empty"}).regex(/^\d+(\.\d+)?$/,{message : "please enter valid number"}).transform((val) => val).refine((val) => +val > 0,{message : "price should be greater than zero"}), // Positive integer for price
    publisher: z.string().min(3, "publisher name must be at least 3 characters"), // Non-empty string
    published_year: z.string().transform((val) => new Date(val).toISOString()).refine((date) => /[TZ.\-:]/.test(date),{ message : "Invalid Date"}), // Date for the published year
    bookImg: z.string().url("Invalid image URL"), // URL for book image
    total_quantity: z.string({required_error : "quantity cannot be empty"}).regex(/^\d+$/,{message : "please enter valid number"}).transform((val) => val).refine((val) =>  +val > 0,{message : "quantity should be greater than zero"}), // Non-negative integer for quantity
    category: z.array(optionSchema).min(1,{message :"Select at least one option"})// Array of non-empty strings
  });

export default function UpdateBook({bookId,mutate,selectedName,className,bookData}){

    const [categoryData,setCategoryData] = useState<Option[]>([]);
    const [open,setOpen] = useState(false);

    const {book_id,name,description,price,publisher,published_year,bookImg,total_quantity,category} = bookData;

    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues : {
            bookId: book_id, // Default 4-digit book ID
            name, // Default book name
            description, // Default description
            price : JSON.stringify(price), // Default price as a string to be transformed later
            publisher, // Default publisher
            published_year : published_year.split("T")[0], // Default to today's date in YYYY-MM-DD format
            bookImg, // Default valid image URL
            total_quantity : JSON.stringify(total_quantity), // Default total quantity as a string to be transformed
            category: [{label : "All",value : "all",fixed : true}], // Default category as an array
        }
      })

      useEffect(() => {
          axios.get("/api/category")
          .then(({data}) => {
            const options : Option[] = [];
            data.map((item : object) => {
              options.push({label : item.name,value : item.slug})
              // setValue([...options]);
              setCategoryData([...options]);
              // console.log(new Date().toISOString());
            })
          })
          .catch((error) => {
            console.log(error);
          })
      },[selectedName])

      function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        form.setValue("category",category.map((item,index) => {
          if(item.slug === "all"){
            return {label : item.name,value : item.slug,fixed : true};
          }else{
            return {label : item.name,value : item.slug};
          }
        }));

        if(!isOpen){
          form.reset();
        }
      }

      function closeDialog(){
        form.reset();
        setOpen(false);
      }

      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof bookSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const categoryOption = category.map((item,index) => {
          if(item.slug === "all"){
            return {label : item.name,value : item.slug,fixed : true};
          }else{
            return {label : item.name,value : item.slug};
          }
        })
        
        if(values.bookId === book_id && values.name === name &&
           values.description === description && 
           values.price === JSON.stringify(price) && values.publisher === publisher 
           && values.published_year === published_year &&
          values.bookImg === bookImg && 
          values.total_quantity === JSON.stringify(total_quantity) 
          && lodash.isEqual(categoryOption,values.category)){
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
            axios.put("/api/book/"+bookId,{
              book_id : values.bookId,
              book_name : values.name,
              description : values.description,
              price : values.price,
              publisher : values.publisher,
              published_year : values.published_year,
              bookImg : values.bookImg,
              total_quantity : values.total_quantity,
              category : values.category
            })
            .then(({data}) => {
              console.log(data);
              mutate();
              toast.success('book updated successfully', {
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
                      <DialogTitle className="text-center">Update the book</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center overflow-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide">
                              <FormField
                                control={form.control}
                                name="bookId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Book id</FormLabel>
                                    <FormControl>
                                      <Input disabled {...field} placeholder="A123F" className="border border-gray-500" type="text"  />
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
                                    <FormLabel>Book name</FormLabel>
                                    <FormControl>
                                      <Input  {...field} placeholder="Simply C" className="border border-gray-500" type="text" />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Book description</FormLabel>
                                    <FormControl>
                                        <Textarea className="border border-gray-500" placeholder="This book will be useful material to the beginners or the computer Science students" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Book Price</FormLabel>
                                    <FormControl>
                                    <Input {...field}  placeholder="Rs.178" className="border border-gray-500"  />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="publisher"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Publisher name</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="Morris Mano" className="border border-gray-500"  />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="published_year"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Published year</FormLabel>
                                    <FormControl>
                                      <Input {...field}  className="border border-gray-500"  type="date"/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="bookImg"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Book imageUrl</FormLabel>
                                    <FormControl>
                                      <Input className="border border-gray-500" placeholder="https://www.xyz.com/photo/category?=book" type="url" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="total_quantity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Book quantity</FormLabel>
                                    <FormControl>
                                      <Input className="border border-gray-500" placeholder="10" type="number" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Select categories</FormLabel>
                                    <FormControl>
                                      <MultipleSelector
                                        {...field}
                                        defaultOptions={categoryData} 
                                        placeholder="Select the category for book"
                                        className="border border-gray-500"
                                      />
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