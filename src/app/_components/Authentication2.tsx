"use client"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation"
import {toast,Bounce} from "react-toastify";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" 

const formSchema = z.object({
  username : z.string({required_error : "username cannot be empty"}).min(4,"Fullname must have at least 4 characters"),
  password : z.string({required_error : "password cannot be empty"}).min(5, 'Password must be at least 5 characters long')
})



export default function Authentication(){

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username : "",
          password : "",
        },
      })

      function onSubmit(values : z.infer<typeof formSchema>){
        
          signIn("credentials",{
              email : values.username as string,
              password : values.password as string,
              redirect : false
          })
          .then((res : any) => {
              if(res){
                if(res.error === null){
                  toast.success("Login Successful", {
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
                    router.refresh();
                }else{
                  toast.error("Invalid Credentials", {
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
              }
              
          }).catch((error : any) => {
              console.log(error);
          })
      }


    return (
        <div className="w-full h-[100vh]">
                <section className="bg-white">
                <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <Image
                      alt=""
                      width={1000}
                      height={1000}
                      src="https://images.unsplash.com/photo-1468273519810-d3fe4c125cdb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                  </section>
                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                  >
                    <div className="max-w-xl lg:max-w-3xl">
                    <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          <h1 className="text-3xl font-semibold">Library Management System</h1>
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input type="text" placeholder="johndoe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="bg-sky-500 shadow-md">Log In</Button>
                          </form>
                        </Form>
                    </div>
                  </main>
                </div>
              </section>
            
        </div>
    )
}

