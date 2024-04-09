import { Outlet } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";

function StudentLayout() {
    const {user} = useUserContext()
    console.log(user.role);
    return (
      <>
          <Outlet/>
      </>
    )
}

export default StudentLayout