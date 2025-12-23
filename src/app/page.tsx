import Header from "./_components/Header";
import Authentication from "./_components/Authentication";
import {auth} from "@/auth"
import CategoryList from "./_components/CategoryList";
import BookList from "./_components/BookList";

export default async function Home(){

  const session = await auth();

  if(!session?.user) return <Authentication/>

  return (
    <div className="w-full relative">
      <Header/>
      <CategoryList/>
      <BookList/>
    </div>
  )
}