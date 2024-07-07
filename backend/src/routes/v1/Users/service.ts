
import { sendMessageToUser } from '../../../..';
import cloudinary from '../../../utils/Cloudinary';
import { create } from '../Notification/repository';
import { User } from './model';
import { createUserRepo, deleteUserByEmail, getAllUsers, getUserAndUpdateRefreshToken, getUserByCodeOk, getUserByEmail, removeFollower, updateUser, updateUserById, updateUserWithToken } from './repository';
import { UpdatedBody } from './type';

const UserService = {
  createUser(userData: User) {
    return createUserRepo(userData);
  },

  getUser(email:string) {
    return getUserByEmail(email)
  },
  getUserAndUpdateRefreshToken(id:string){
    return getUserAndUpdateRefreshToken(id)
  },
  getUserById(id:string){
    return getUserByCodeOk(id)
  },
  //updating user while registering
  updateUserInfo(email:string){
    return updateUser(email)
  },
  updateUserWithToken(email:string,accessToken:string){
    return updateUserWithToken(email,accessToken)
  },
  //updating user info
  async updateUser(id:string,body:UpdatedBody){
    const user = await this.getUserById(id)
    const friend:string =body.friend && body.friend.toString() || ""
    if(user && body.friend && user.friends?.includes(body.friend)){
      const res=await removeFollower(id,body)
      if (res) {
        const message ={ username:user.username,userId:body.friend,time:new Date( Date.now()).toISOString(),content:`${user?.username} has unfollowed you.`}
        await create(message)
        sendMessageToUser(friend, message);
      }
      return res
    }else{
      const res = await updateUserById(id,body)
      if (res) {
        const message ={ username:user && user?.username || "",userId:body.friend || "",time:new Date( Date.now()).toISOString(),content:`${user?.username} started following you.`}
        await create(message)
        sendMessageToUser(friend, message);
      }
      return res
    }
    
  },
  getUsers() {
    return getAllUsers()
  },
  deleteUser(email:string){
    return deleteUserByEmail(email)
  },
  async uploadProfile(files:Express.Multer.File[]){
    const uploadImagePromises = files.map((image) =>
            cloudinary.uploader.upload(image.path)
        );
    try {
            const results = await Promise.all(uploadImagePromises);
            const uploadUrls: string[] = results.map(result => result?.secure_url);
            
            return uploadUrls
        } catch (err) {
            console.error(err);
        }
  }
};

export default UserService;
