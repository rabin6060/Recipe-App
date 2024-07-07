import { NextFunction, Request,Response } from "express";

import { successResponse } from "../../../utils/HttpResponse";
import { ActivityService } from "./service";
import { Activity } from "./type";




export const ActivityController = {
    async create(req:Request<unknown,unknown,Activity>,res:Response,next:NextFunction){
    try {
      const activity = req.body;

      const newActivity = await ActivityService.createActivity(activity);
      return successResponse({
        response: res,
        message: 'Activity added successfully!!',
        data: newActivity,
      });
    } catch (error) {
      next(error);
    }
    },

    async get(req:Request,res:Response,next:NextFunction){
      try {
        const user = res.locals.user
        const Activities = await ActivityService.getActivities(user._id);
      return successResponse({
        response: res,
        message: 'Activities fetched successfully!!',
        data: Activities,
      });
      } catch (error) {
        next(error)
      }
    }
    
}