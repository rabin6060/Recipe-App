import { ObjectId } from "mongoose"

export interface Activity{
    username:string
    time:string
    content:string,
    userId:string | ObjectId
}