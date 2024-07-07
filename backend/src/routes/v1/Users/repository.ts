
import { User, UserDocument, UserModel } from './model';
import { UpdatedBody } from './type';

export const createUserRepo = (userData: User): Promise<UserDocument> => {
  const user = new UserModel(userData);
  return user.save();
};

export const getAllUsers = () => {
  return UserModel.find().select('-password');
};

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email: email }).select('-__v -createdAt -updatedAt -password')
};

export const updateUserWithToken = async(email: string, accessToken: string)=> {
    const user = await getUserByEmail(email).select('-password -__v -createdAt -updatedAt -verificationAttempt')
    if (!user) {
      throw new Error('User not found');
    }
    user.accessToken = accessToken;
    await user.save();
    return user;
  }




export const getUserByEmailForAuth = (email: string) => {
  return UserModel.findOne({ email: email })
};

export const getUserByCodeOk = (id: string) => {
  return UserModel.findById(id);
};
export const updateUser = (email: string) => {
  return UserModel.findOneAndUpdate({ email: email },{$unset:{
    pin:1
  }}).select('-password -__v -createdAt -updatedAt -verificationAttempt')
};
export const removeFollower = (id:string,body:UpdatedBody) =>{
  return UserModel.findByIdAndUpdate(
    id,
    { $pull: { friends: body.friend } },
    { new: true }
  )
} 

export const updateUserById =async (id:string,body:UpdatedBody)=>{
  const {username,profilePic,friend} = body
   if (friend) {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: {
        username:username,
        profilePic:profilePic
        }, $addToSet: { friends: friend } },
      { new: true }
    )
  } else {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: {
        username:username,
        profilePic:profilePic
        } },
      { new: true }
    );
  }
}
export const deleteUserByEmail = (email: string) => {
  return UserModel.findOneAndDelete({email:email});
};
export const getUserAndUpdateRefreshToken = (id:string) => {
  return UserModel.findByIdAndUpdate(id,{
    $unset:{
      accessToken : 1
    }
  },{new:true})
}

export const getUserById = (id: string) => {
  return UserModel.findById(id);
};
