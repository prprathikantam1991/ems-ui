import { Employee } from "./employee";

export interface Department {
    id : number;
    name : string;
    description : string;
    employees : Employee[]
}