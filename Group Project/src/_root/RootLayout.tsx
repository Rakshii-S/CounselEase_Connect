import { Navigate, Outlet } from "react-router-dom"
import { useUserContext } from "../../context/AuthContext"
import CounsellorLayout from "./counsellor pages/CounsellorLayout";
import AdminLayout from "./admin pages/AdminLayout";
import StudentLayout from "./student pages/StudentLayout";
import BuddyLayout from "./buddy pages/BuddyLayout";
import TopBar from "./shared/TopBar";
import LeftBar from "./shared/LeftBar";
import RightBar from "./shared/RightBar";
import BottomBar from "./shared/BottomBar";
import { Toast } from "../../@/components/ui/toast";

function RootLayout() {
  const {user} = useUserContext()
  return(
    <>
    {user?(
      <div className="w-full md:flex">
      <TopBar/>
      <LeftBar/>
      <section className="flex flex-1 h-full">
        <>
        {user.role == "admin" && (
          <>
            <Toast/>
            <AdminLayout/>
          </>
        )}
        {user.role == "counsellor" && (
          <>
          <Toast/>
          <CounsellorLayout/>
          </>
        )}
        {user.role == "student" && (
          <>
          <Toast/>
          <StudentLayout/>
          </>
        )}
        {user.role == "buddy" && (
          <>
          <Toast/>
          <BuddyLayout/>
          </>
        )}
        </>
      </section>
      <RightBar/>
      <BottomBar/>
    </div>
    ):(
      <Navigate to="/login"/>
    )}
    </>
  )
}

export default RootLayout