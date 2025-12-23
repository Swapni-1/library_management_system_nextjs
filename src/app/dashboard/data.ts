import { Home,Book,ChartColumnStacked,User,BookCheck,BookUser} from  "lucide-react"
const sidebarData = [
    {
        name : "Home",
        icon : Home
    },
    {
        name : "Book",
        icon : Book
    },
    {
        name : "Student",
        icon : User
    },
    {
        name : "Category",
        icon : ChartColumnStacked
    },
    {
        name : "Issued book",
        icon : BookUser
    },
    {
        name : "Returned book",
        icon : BookCheck
    }
]

const bookData = [
    {
        bookId : "1",
        name : "A Complete Guide to Programming in C++",
        description : "A Complete Guide to Programming in C++ was written for both students interested in learning the C++ programming language from scratch, and for advanced C++ programmers wishing to enhance their knowledge of C++. The chapters are organized to guide the reader from elementary language concepts to professional software development, with in-depth coverage of all the C++ language elements 'en route.' The order in which these elements are discussed reflects the goal of helping students create useful programs every step of the way.",
        price : "19544",
        publisher : "Ulla Kirch-Prinz",
        published_year : "20/08/2001",
        ImageUrl : "https://m.media-amazon.com/images/I/610zC1RHCcL._SY522_.jpg",
        total_quantity : 10,
        categories : [{name : "All"},{name : "Programming"}]
    },
]

const semester = ["FIRST","SECOND","THIRD","FOURTH","FIFTH","SIXTH","SEVENTH","EIGHT"];

const year = ["FIRST","SECOND","THIRD","FOURTH"];

const course_name = ["BCA","BTECH","BBA","BCOM","BA","BED","BSc","PGDCA","MCA","MTECH","MBA","MSc","MCOM"];
export {sidebarData,bookData,semester,year,course_name};