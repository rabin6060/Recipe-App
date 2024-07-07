export interface UserInfo{
    status?:number,
    message?:string,
    data:{
        _id:string,
        username:string,
        email:string,
        accessToken:string,
        profilePic:string,
        friends:string[],
        favourites:RecipeData[]
}
}
export interface AllUserInfo{
    status:number,
    message:string,
    data:[{
        _id:string,
        username:string,
        email:string,
        accessToken:string,
        profilePic:string,
        friends:string[],
        pin:string
}]
}
