export const messages = {
  user: {
    creation_success: 'User Created Successfully',
    verfiy_user:"check your email to verify!!",
    verification_failed:"verification failed!!",
    user_exist:"user already exist!!",
    user_not_found:"user not found!!",
    user_found:'user with id found'
  },
  post: {
    creation_success: 'Post Created Successfully',
    all_get_success: 'Posts Fetched Successfully',
    one_get_success: 'Post Fetched Successfully',
    not_found: 'Post With Given Id Not Found',
    edit_success: 'Post Edited Successfully',
    delete_success: 'Post Deleted Successfully',
    edit_forbidden: 'Forbidden To Edit Post',
    delete_forbidden: 'Forbidden To Delete Post',
    validation: {
      missing_author: 'Please provide author in message body',
    },
  },
  auth: {
    login_success: 'LoggedIn Successfully',
    invalid_account: 'Invalid Password or Email',
    logout:'logout successfully!!'
  },
  error: {
    internal_server_error: 'Internal Server Error',
  },
};
