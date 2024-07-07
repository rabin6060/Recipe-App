
export interface Review{
    userId?:string,
    recipeId?:string,
    content?:string, 
    rating?:string, 
    user:string,
    type: string,
    username?:string
}

export interface UpdatedReview{
    content:string
    rating:string
    type:string
}