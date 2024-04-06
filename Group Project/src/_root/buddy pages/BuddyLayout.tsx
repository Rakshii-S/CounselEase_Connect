import { Outlet } from 'react-router-dom';
import { useUserContext } from '../../../context/AuthContext';
import LeftBar from '../shared/LeftBar';
import TopBar from '../shared/TopBar';
import RightBar from '../shared/RightBar';
import BottomBar from '../shared/BottomBar';

function BuddyLayout() {
    const {user} = useUserContext()
    console.log(user.role);
    return (
      <>
          <Outlet/>
      </>
    )
}

export default BuddyLayout