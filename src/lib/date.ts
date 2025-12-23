import {format} from "date-fns";

const date = (_date : string) =>{
    return format(_date,"dd/MM/yyyy");
}


export {date};