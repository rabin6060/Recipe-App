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

import { format } from "date-fns";

import {  useNotification } from "@/Context/Notification";

const Navbar = () => {
  const [_error, setError] = useState<Error | null>(null);
  const [chat, setChat] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [notification,setNotification] = useState<boolean>(false)
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  
  const {notifications,setNotifications} = useNotification()
  const sortNotification = notifications.sort((a,b)=>(new Date(b.time).getTime()) - (new Date(a.time).getTime()))
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
                      <span className="text-slate-500 text-sm">
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
            <div className={`relative w-full ${user ? "flex" : "hidden"}`}>
              <IoChatbubblesOutline
                className="text-3xl cursor-pointer bg-transparent dark:text-white hover:scale-110 transition-all duration-200 linear"
                onClick={() => {
                  setChat((prev) => !prev)
                  setNotification(false)
                  setShow(false)
                  }}
              />
              <div className="w-[22px] h-[22px] bg-red-500 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold absolute -top-3 -right-2">
                2
              </div>
            </div>
            <div className={`relative w-full ${user ? "flex" : "hidden"}`}>
              <IoMdNotificationsOutline
                id="bell"
                className={`text-3xl cursor-pointer bg-transparent dark:text-white hover:scale-110 transition-all duration-200 linear`}
                onClick={() =>{
                   setNotification((prev) => !prev)
                   setShow(false)
                   setChat(false)
                   }}
              />
              <div className="w-[22px] h-[22px] bg-red-500 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold absolute -top-3 -right-2">
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
                onClick={() =>{ 
                  setShow((prev) => !prev)
                  setChat(false)
                  setNotification(false)
                  }}
              >
                <div className="hover:scale-[1.03] transition-all duration-200">
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
        {chat && (
          <div
            className={`h-[60vh] w-1/4 border rounded-lg fixed bottom-0 right-[15rem] shadow-md bg-white z-50 transition-transform duration-300 ease-linear rounded-t-lg space-y-2 dark:bg-slate-50 transform ${
              chat ? " opacity-100" : " opacity-0"
            }`}
          >
            <h3 className="text-2xl border-b p-2 bg-blue-500 rounded-t-lg text-white font-semibold">
              Chat
            </h3>
            {/*chat box */}
            <div className="h-[80%]"></div>
            <div className="border m-2 flex items-center justify-center rounded-lg">
              <Input className="border-none" placeholder="start a chat" />
              <IoSend className="text-blue-500 pr-2" size={30} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Navbar;
