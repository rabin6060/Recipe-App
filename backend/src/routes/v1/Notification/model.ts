import mongoose from "mongoose";
import { Activity } from "./type";

const notificationSchema = new mongoose.Schema<Activity>({
    username:{
      type:String,
      required:true
    },
    time:{
      type:String,
      required:true
    },
    content:{
      type:String,
      required:true
    },
    userId:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:true
    },
    recipeId:{
      type:mongoose.Schema.ObjectId,
      ref:'recipe',
      required:false
    }
},{timestamps:true})

export const NotificationModel =  mongoose.model('notification',notificationSchema)