import { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '../../../@/components/ui/button';
import { useUserContext } from '../../../context/AuthContext';
import { useGetCurrentUserCollection, useSignOutAccout } from '../../../@/lib/react_query/queryNmutation';

function TopBar() {
const {mutate: signOut, isSuccess} = useSignOutAccout();
const navigate = useNavigate();
const {user} = useUserContext();
const {data: currentUser} = useGetCurrentUserCollection(user.accountid, user.role);


useEffect(()=>{
    if(isSuccess) navigate(0);
},[isSuccess])

  return (
    <section className='topbar'>
        <div className='flex-between py-4 px-5'>
            <Link to="/" className='flex gap-3 items-center'>
            <img 
                    src="/assets/mainlogo.png"
                    alt="logo"
                    width={50}
                />
            </Link>
            <div className='flex gap-4'>
                {user.role=="student" ?(
                    <Button variant="ghost" className='shad-button_ghost'>
                    <img 
                    src="/assets/activity.png" 
                    width={37}
                    alt="activity"
                    className={`invert-white`}/>
                </Button>
                ):(
                    <></>
                )}
                <NavLink
                            to={`/edit-email-password/${user.accountid}`}
                            className="flex gap-4 items-center p-1">
                                <img 
                                src="/assets/edit2.png"
                                alt=""
                                width={35}
                                className={`invert-white`}/>
                            </NavLink>
                <Button variant="ghost" className='shad-button_ghost' onClick={()=>signOut()}>
                    <img 
                    src="/assets/logout.png" 
                    width={30}
                    alt="logout"
                    className={`invert-white`}/>
                </Button>
                <Link to={`/profile/${user.accountid}`} className='flex-center gap-3'>
                    <img 
                    src={currentUser?.imageUrl || `https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=338&ext=jpg&ga=GA1.1.2082370165.1710547200&semt=ais`}
                alt="profile"
                className='h-10 w-10 rounded-full'
                    />
                </Link>
            </div>
        </div>
    </section>
  )
}

export default TopBar