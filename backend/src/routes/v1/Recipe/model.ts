import mongoose from 'mongoose';
import { Recipe } from './type';


const recipeSchema = new mongoose.Schema<Recipe>(
  {
     userId: {
      type: mongoose.Schema.ObjectId,
      ref:'User',
      required: false
    },
    title:{
      type:String,
      required: [true, 'Title is Required'],
    },
    desc: {
      type: String,
      required: [true, 'Desc is Required'],
    },
    cookingPeriod: {
      type: String,
      required: [true, 'Time is Required'],
    },
    images:[{
      type:String,
      required:[true,'images required'],
    }],
    video:{
        type:String,
        required:true
    },
    ingredients:[{
        type:String,
        required:[true,'ingredients required']
    }],
   
    categories:{
        type:String,
        required:[true,'categories required']
    },
    instructions:[{
      step:String,
      substep:[
        {
          title:String,
          desc:String
        }
      ],
    }],
    comments:[{
      type: mongoose.Schema.ObjectId,
      ref:'review',
      required:false
    }],
    ratings:[{
      type: mongoose.Schema.ObjectId,
      ref:'review',
      required:false
    }],
  },
  {
    timestamps: true,
  },
);


export const RecipeModel = mongoose.model('recipe', recipeSchema);
