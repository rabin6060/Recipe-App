import { ObjectId } from "mongoose";
import { create, getActivity, getAll } from "./repository";
import { Activity } from "./type";

export const ActivityService={
    createActivity(activity:Activity){
        return create(activity)
    },
    getSingleActivity(taskId:ObjectId){
        return getActivity(taskId)
    },
    getActivities(id:string){
        return getAll(id)
    },

}