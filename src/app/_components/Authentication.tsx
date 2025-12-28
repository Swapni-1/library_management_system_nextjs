"use client"
import Image from "next/image"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {toast,Bounce} from "react-toastify"
import {signIn} from "next-auth/react"
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
import { House } from "lucide-react";
import {useRouter} from "next/navigation";
import axios from "axios";

const registerFormSchema = z.object({
  username : z.string({required_error : "username cannot be empty"}).min(4,"Fullname must have at least 4 characters"),
  email : z.string({required_error : "email cannot be empty"}).email("Invalid email address"),
  password : z.string({required_error : "password must be empty"}).min(4, 'Password must be at least 4 characters long')
})

const loginFormSchema = z.object({
  username : z.string({required_error : "password cannot be empty."}).min(4,"Fullname must have at least 4 characters"),
  password : z.string({required_error : "password cannot be empty."}).min(4, 'Password must be at least 4 characters long')
})



export default function Auth(){

    const [isLogin,setIsLogin] = useState(true);
    const router = useRouter();

    const registerForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
          username : "",
          email : "",
          password : ""
        },
      })

      const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
          username : "",
          password : ""
        },
      })
      
      // 2. Define a submit handler.
      function onSubmitLogin(values: z.infer<typeof loginFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        signIn("credentials",{
          username : values.username as string,
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
          .finally(() => {
            registerForm.reset();
            loginForm.reset();
          })
        
      }

      function onSubmitRegister(values : z.infer<typeof registerFormSchema>){
          axios.post("/api/user",{
            username : values.username,
            email : values.email,
            password : values.password
          })
          .then(({data}) => {
            if(data){
              setIsLogin(true);
              toast.success("user created successfully", {
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
          .catch(error => console.log(error))
          .finally(() => {
            registerForm.reset();
            loginForm.reset();
          })
          
      }


    return (
        <div className="w-full h-[100vh]">
            {
                isLogin ? 
                (
                <section className="bg-white relative">
                <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                
                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                  >
                    
                    <div className="max-w-xl lg:max-w-3xl ">
                    
                    <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-8">
                            <h1 className="text-3xl font-semibold">Library Management System</h1>
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username/Email</FormLabel>
                                  <FormControl>
                                    <Input type="text" placeholder="johndoe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                              <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="*******" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="bg-primary shadow-md">Login</Button>
                          </form>
                        </Form>
                        <h2 className="mt-2">Don&apos;t have account ? <span className="text-primary cursor-pointer underline" onClick={() => setIsLogin(false)}>Create</span> </h2>
                    </div>
                  </main>
                  <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <Image
                      alt=""
                      width={1000}
                      height={1000}
                      src="https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                  </section>
              
                  
                </div>
              </section>
                )
                :
                (
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
                    className="flex relative items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                  >
                    <div className="max-w-xl lg:max-w-3xl">
                    <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-5">
                          <h1 className="text-3xl font-semibold">Register</h1>
                            <FormField
                              control={registerForm.control}
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
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="johndoe@gmail.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
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
                            <Button type="submit" className="bg-primary shadow-md">Sign Up</Button>
                          </form>
                        </Form>
                        <h2 className="mt-2">Already have account ? <span className="text-primary cursor-pointer underline" onClick={() => setIsLogin(true)}>Login</span> </h2>
                    </div>
                  </main>
                </div>
              </section>
                
                )
            }
        </div>
    )
}

