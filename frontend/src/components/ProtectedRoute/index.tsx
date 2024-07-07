import { useUser } from "@/Context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/recipe" />;
  }

  return <Outlet />;
};

export default Protected;