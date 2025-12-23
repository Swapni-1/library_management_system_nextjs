import { Dialog,DialogContent,DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";


export default function DeleteDialogButton({title,disabled,deleteId,deleteType,mutate}){
    const [open,setOpen] = useState(false);

    

    function handleClick(){
      switch(deleteType){
        case "book" : deleteBookById(deleteId)
        break;

        case "student" : deleteStudentById(deleteId)
        break;

        case "category" : deleteCategoryById(deleteId)
        break;

        case "issued-book" : deleteIssuedBookById(deleteId)
        break;

        case "returned-book" : deleteReturnedBookById(deleteId);
        break;
      }
    }

    function deleteBookById(id:string){
      axios.delete("/api/book/"+id)
      .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`book deleted successfully`, {
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
        console.log(error)
      })
      .finally(() => {
        closeDialog();
      })
    }

    function deleteStudentById(id:string){
      axios.delete("/api/student/"+id)
      .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`student deleted successfully`, {
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
        console.log(error)
      })
      .finally(() => {
        closeDialog();
      })
    }

    function deleteCategoryById(id:string){
      axios.delete("/api/category/"+id)
      .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`category deleted successfully`, {
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
        console.log(error)
      })
      .finally(() => {
        closeDialog();
      })
    }

    function deleteIssuedBookById(id:string){
      axios.delete("/api/book-issue/"+id)
      .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`issued book deleted successfully`, {
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
        console.log(error)
      })
      .finally(() => {
        closeDialog();
      })
    }

    function deleteReturnedBookById(id:string){
      axios.delete("/api/book-return/"+id)
      .then(({data}) => {
        console.log(data);
        mutate();
        toast.success(`returned book deleted successfully`, {
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
        console.log(error)
      })
      .finally(() => {
        closeDialog();
      })
    }

    function closeDialog(){
      setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button  variant={"destructive"} disabled={disabled}>Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">{title}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center gap-4 mt-4">
                <Button onClick={closeDialog} variant={"outline"}>Close</Button>
                <Button onClick={handleClick} variant={"destructive"}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
    )
}