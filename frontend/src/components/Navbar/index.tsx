import { ModeToggle } from "../mode-toggle";
import { SiFoodpanda } from "react-icons/si";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatbubblesOutline, IoSend } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatars } from "../Avatar";
import { Input } from "../ui/input";
import { useUser } from "@/Context/UserContext";
import { logout } from "@/api/user";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { format } from "date-fns";
import { Chat, useNotification } from "@/Context/Notification";

const Navbar = () => {
  const [_error, setError] = useState<Error | null>(null);
  const [chat, setChat] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(false);
  const [ishovered, setIsHovered] = useState<boolean>(false);
  const [chatText, setChatText] = useState<string>("");
  const { user, users, setUser } = useUser();
  const [currentUser, setCurrentUser] = useState<string>("");
  const navigate = useNavigate();
  const { notifications, socket, chats, setChats, setNotifications } = useNotification();

  const sortNotification = notifications.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  const handleLogout = async () => {
    try {
      await logout(user?.data?._id);
      localStorage.removeItem("user");
      setUser(null);
      setShow(false);
      setNotifications([]);
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data);
        }
      }
    }
  };



  const handleChat = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();

    const newChatMessage = {
      toUserId: id || "",
      fromUserId: user?.data._id || "",
      fromUser: user?.data.username || "",
      content: chatText,
      time: new Date().toISOString(),
    };

    // Update local state with the new message
    setChats((prevChats: Chat[]) => [...prevChats, newChatMessage]);

    // Reset the chat input field
    setChatText("");

    // Emit the chat message via socket
    if (socket) {
      socket.emit("chat", newChatMessage);
    }
  };
  return (
    <section className="h-auto w-full shadow-lg fixed top-0 z-50 bg-white dark:bg-black">
      <div className="max-w-[75%] mx-auto relative h-full py-3 flex items-center justify-between border-b-[1px] dark:border-white">
        <div
          className="flex items-center justify-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <SiFoodpanda className="text-4xl dark:text-white" />
          <h1 className="text-3xl font-semibold dark:text-white">Foodiee</h1>
        </div>

        <div
          className={`h-[90vh] w-1/4 border rounded-lg absolute top-20 right-0 bg-white z-50 transition-transform duration-300 ease-linear p-2 overflow-y-auto overflow-hidden space-y-2 dark:bg-slate-50 transform ${
            notification
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <h3 className="text-2xl hover:scale-[1.01] transition-all duration-100 linear cursor-pointer ">
            Notifications
          </h3>
          <div className="flex flex-col gap-2 pb-5 h-full">
            {sortNotification &&
              sortNotification.map((notification) => (
                <div className="p-2 flex gap-5 cursor-pointer rounded-lg shadow-md">
                  <Avatars />
                  <div className="w-[90%] flex flex-col">
                    <h4 className="text-lg flex flex-col">
                      {notification.username}{" "}
                      <span className="text-slate-500 text-xs">
                        {format(
                          new Date(notification?.time),
                          "MMMM d,  h:mm a"
                        )}
                      </span>
                    </h4>

                    <p className="text-sm">{notification.content}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className="border-2 group cursor-pointer bg-transparent px-2 rounded-md flex items-center justify-center"
          onClick={() => navigate("/recipe")}
        >
          <h3 className="p-2 text-slate-500">Browse Recipes</h3>
          <CiSearch className="text-3xl bg-transparent dark:text-white group-hover:scale-110 transition-all duration-200 linear" />
        </div>

        <div className="flex gap-5">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`relative inline-block w-full ${
                user ? "flex" : "hidden"
              }`}
            >
              <IoChatbubblesOutline
                className="text-3xl cursor-pointer bg-transparent dark:text-white hover:scale-110 transition-all duration-200 linear"
                onClick={() => {
                  setChat(false);
                  setIsHovered((prev) => !prev);
                  setNotification(false);
                  setShow(false);
                }}
              />
              {ishovered && (
                <div className="absolute top-14 h-[59vh] w-[300px] shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 ease-in-out bg-slate-50 rounded-lg p-2">
                  <h3 className="text-2xl text-slate-500">Chats</h3>
                  <div className="flex flex-col gap-2">
                    {users?.data.map((friend, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between bg-white border-b p-2 rounded-md cursor-pointer gap-2 border hover:shadow-md transition-all duration-150 ease-linear ${
                          user?.data.friends.includes(friend._id)
                            ? "flex"
                            : "hidden"
                        }`}
                        onClick={() => {
                          setChat((prev) => !prev);
                          setCurrentUser(friend._id);
                        }}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                              <img
                                src={friend.profilePic}
                                alt="profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{friend.username}</span>
                          </div>
                          
                          <span className={`w-[24px] h-[24px] text-sm bg-red-500 dark:bg-white rounded-full items-center justify-center text-white dark:text-black font-semibold ${chats && chats.filter(chat=>chat.fromUserId===friend._id).length > 0 ? 'flex' :'hidden'}`}>{ chats && chats.filter(chat=>chat.fromUserId===friend._id).length}</span>
                        </div>
                      </div>
                    ))}
                    {currentUser && chat && (
                      <div
                        className={`h-[60vh] w-1/4 border rounded-lg fixed bottom-0 right-[15rem] shadow-md bg-white z-50 transition-transform duration-300 ease-linear rounded-t-lg space-y-2 dark:bg-slate-50 transform ${
                          currentUser ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div className="w-full flex items-center justify-between gap-4 p-1 border-b bg-blue-500 rounded-t-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                            <img
                              src={
                                users?.data.find(
                                  (user) => user._id === currentUser
                                )?.profilePic
                              }
                              alt="profile"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <h3 className=" text-2xl text-white font-semibold">
                            {
                              users?.data.find(
                                (user) => user._id === currentUser
                              )?.username
                            }
                          </h3>

                          </div>
                          
                          <ImCross
                            className="mr-3 text-xl text-white hover:scale-[1.07] transition-all duration-150 ease-linear"
                            onClick={() => setChat(false)}
                          />
                        </div>

                        <div className="h-[80%] overflow-hidden overflow-y-auto space-y-1">
                          {chats &&
                            chats.map((chat) => (
                              <div
                                key={chat.time}
                                className={`m-1 flex flex-col ${
                                  chat.fromUserId !== user?.data._id
                                    ? "items-start "
                                    : "items-end"
                                }`}
                              >
                                {((
                                    chat.fromUserId === currentUser) || (chat.toUserId === currentUser &&
                                  chat.fromUserId === user?.data._id)
                                  ) && (
                                  <>
                                    <p
                                      className={`${
                                        chat.fromUserId !== user?.data._id
                                          ? "bg-teal-500 "
                                          : "bg-blue-500"
                                      } p-2 font-semibold break-words rounded-lg text-white`}
                                    >
                                      {chat.content}
                                    </p>
                                    <span className="text-slate-500 text-xs ml-1">
                                      {format(new Date(chat.time), "h:mm a")}
                                    </span>
                                  </>
                                )}
                                </div>
                            ))}
                        </div>
                        <form className="border m-2 flex items-center justify-center rounded-lg" onSubmit={(e) => handleChat(e, currentUser)}>
                          <Input
                            className="border-none"
                            placeholder="Start a chat"
                            value={chatText}
                            autoFocus
                            onChange={(e) => setChatText(e.target.value)}
                          />
                          <IoSend
                            className="text-blue-500 pr-2 cursor-pointer"
                            size={30}
                            type="submit"
                          />
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={`w-[24px] h-[24px] text-sm bg-red-500 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold absolute -top-3 -right-2 ${chats && chats.filter(chat=>chat.fromUserId!==user?.data._id).length>0 ? 'flex':'hidden' }`}>
                {
                  chats && chats.filter(chat=>chat.fromUserId!==user?.data._id).length
                }
              </div>
            </div>
            <div className={`relative w-full ${user ? "flex" : "hidden"}`}>
              <IoMdNotificationsOutline
                id="bell"
                className={`text-3xl cursor-pointer bg-transparent dark:text-white hover:scale-110 transition-all duration-200 linear`}
                onClick={() => {
                  setNotification((prev) => !prev);
                  setShow(false);
                  setChat(false);
                  setIsHovered(false);
                }}
              />
              <div className="w-[24px] h-[24px] bg-red-500 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-sm absolute -top-3 -right-2">
                {notifications?.length || 0}
              </div>
            </div>
          </div>
          {!user ? (
            <div className="flex items-center justify-center gap-3">
              <Link
                to={"/login"}
                className="text-lg dark:text-white pr-3 border-r border-black dark:border-r-white"
              >
                Login
              </Link>
              <Link to={"/signup"} className="text-lg dark:text-white">
                Signup
              </Link>
            </div>
          ) : (
            <>
              <div
                className="flex items-center justify-center gap-2 capitalize text-xl font-semibold cursor-pointer  "
                onClick={() => {
                  setShow((prev) => !prev);
                  setChat(false);
                  setNotification(false);
                  setIsHovered(false);
                }}
              >
                <div className="hover:scale-[1.03] transition-all duration-200 dark:text-white">
                  {user && user?.data?.username}
                </div>
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                  <img
                    src={user.data.profilePic}
                    alt="image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div
                className={`fixed top-20 w-[200px] bg-slate-100 py-3 px-2 rounded-lg hover:shadow-md ${
                  show ? "flex flex-col" : "hidden"
                }`}
              >
                <Link
                  to={"profile"}
                  onClick={() => setShow((prev) => !prev)}
                  className="cursor-pointer hover:scale-[1.03] transition-all duration-300 ease-linear"
                >
                  Profile
                </Link>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer hover:scale-[1.03] transition-all duration-300 ease-linear"
                >
                  Logout
                </div>
              </div>
            </>
          )}

          <ModeToggle />
        </div>
      </div>
    </section>
  );
};

export default Navbar;
