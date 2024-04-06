import { Outlet } from "react-router-dom"
import LeftBar from "../shared/LeftBar"
import TopBar from "../shared/TopBar"
import RightBar from "../shared/RightBar"
import BottomBar from "../shared/BottomBar"
import { useUserContext } from "../../../context/AuthContext"

function CounsellorLayout() {
  const {user} = useUserContext()
  console.log(user.role);
  return (
    <>
        <Outlet/>
    </>
  )
}

export default CounsellorLayout