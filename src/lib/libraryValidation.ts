//1. if student has crossed his issue limit ex- max limit : 2
//2. if student try to reissue without return the book | issue === return
//3. if student try to return the book which he not issued | issue > return
//4. checking if the book is available to issue the student | issue - return = available book

import axios from "axios";
// import {prisma} from "./prisma"


// Function to check how many different books are currently issued



async function bookIssueValidation(studentId : string,bookId : string){
    const bookIssueData = axios.get("/api/student/"+studentId)
    .then(({data}) => {
        const { bookIssue, bookReturn } = data;
        
        
        const currentBookIssue = bookIssue.filter(
            book => book.book[0].book_id === bookId
          );
        const currentBookReturn = bookReturn.filter(
          book => book.book[0].book_id === bookId
        );

        const newData = currentBookIssue.slice(currentBookReturn.length, currentBookIssue.length);


        console.log(newData);

        if(newData.length > 1){
            if (newData[1].book[0].book_id === bookId) {
                return {canIssue : false,message : 'This book is already issued'};
            }
        }

        if(newData.length === 1){
            if (newData[0].book[0].book_id === bookId) {
                return {canIssue : false,message : 'This book is already issued'};
            }
        }

        if (newData.length === 2) {
            return {canIssue : false,message : 'Already 2 book are issued'};
        }

        return {canIssue : true, message : "Book issued successfully"};
    })
    .catch(error => console.log(error))
    return bookIssueData;
}


async function bookReturnValidation(studentId : string,bookId : string){
    const bookRetunedData = axios.get("/api/student/"+studentId)
    .then(({data}) => {
        const { bookIssue, bookReturn } = data;
        const currentBookIssue = bookIssue.filter(
            book => book.book[0].book_id === bookId
          );
        const currentBookReturn = bookReturn.filter(
          book => book.book[0].book_id === bookId
        );

        if (currentBookIssue.length === currentBookReturn.length) {
            return {canReturn : false,message : 'Book is not yet issued.'}
          } else {
            return {canReturn : true,message : 'You can return the book.'}
          }
    })
    .catch(error => console.log(error))
    return bookRetunedData;
}

async function checkBookAvailable(bookId : string){
    const {data : bookData} = await axios.get("/api/book/"+bookId);
    const {total_quantity,bookIssue,bookReturn} = bookData[0];

    const availableBook = total_quantity - (bookIssue.length - bookReturn.length);
    return availableBook;
}

async function isStudentExists(studentId : string){
    const {data : isExists} = await axios.get("/api/student/"+studentId);

    if(isExists){
        return true;
    }else{
        return false;
    }
}

async function isBookExists(bookId : string){
    const {data : isExists} = await axios.get("/api/book/"+bookId)

    if(isExists.length > 0){
        return true;
    }else{
        return false;
    }
}

export {
    checkBookAvailable,
    bookIssueValidation,bookReturnValidation,
    isStudentExists,isBookExists
};

