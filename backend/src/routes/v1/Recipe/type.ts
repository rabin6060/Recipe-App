import {ObjectId} from "mongoose";

export interface Recipe {
  userId?:ObjectId | undefined,
  title:string,
  desc:string,
  cookingPeriod:string,
  images?:string[] | undefined,
  video?:string | undefined,
  ingredients:string[],
  categories:string,
  instructions:Instruction[],
  comments?:ObjectId[],
  ratings?:ObjectId[],
  username?:string
}

interface Instruction{
  step:string,
  substep:SubStep[]
}

interface SubStep{
  title:string,
  desc:string
}



