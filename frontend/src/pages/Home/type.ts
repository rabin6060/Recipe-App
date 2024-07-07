
interface RecipeData {
  _id:string,
  userId?:User,
  title:string,
  desc:string,
  cookingPeriod:string,
  images:string[] ,
  video:string,
  ingredients:string[],
  categories:string[],
  instructions:Instruction[],
  comments:Comment[],
  ratings:Comment[],
  createdAt:string
}
interface Instruction{
  step:string,
  substep:SubStep[]
}

interface SubStep{
  title:string,
  desc:string
}

interface Comment{
    _id:string,
    userId:string,
    recipeId:string,
    content:string, 
    rating:string, 
    user:string,
    type: string,
    createdAt:string
}
interface User{
        _id:string,
        username:string,
        email:string,
        accessToken:string,
        profilePic:string,
        createdAt:string,
        updatedAt:string
}