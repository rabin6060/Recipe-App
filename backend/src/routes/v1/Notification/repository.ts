import { ObjectId } from "mongoose"
import { NotificationModel } from "./model"
import { Activity } from "./type"


export const create =  (activity:Activity) =>{
    return  NotificationModel.create(activity)
}
export const getAll =  (id:string) =>{
    return  NotificationModel.find({userId:id})
}
export const getActivity =  (taskId:ObjectId) =>{
    return NotificationModel.find({taskId:taskId})
}


