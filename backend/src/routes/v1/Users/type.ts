import { ObjectId } from "mongoose";




export interface Body{
    username:string,
    email:string,
    password:string,
    profilePic:string,
}

export interface UpdatedBody{
    username?:string,
    profilePic?:string | undefined,
    friend?:ObjectId | undefined,
    favourite?:ObjectId
}