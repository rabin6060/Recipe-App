export interface UserInfo{
    status?:number,
    message?:string,
    data:{
        _id:string,
        username:string,
        email:string,
        accessToken:string,
        profilePic:string,
        friends:string[]
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
