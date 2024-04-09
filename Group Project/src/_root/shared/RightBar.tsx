import {  useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "../../../@/components/ui/button.tsx";
import { useUserContext } from "../../../context/AuthContext.tsx";
import { useGetCurrentUserCollection } from "../../../@/lib/react_query/queryNmutation.tsx";
function RightBar() 
{
    //constants
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    //tanstack query, appwrite and context
    // const {mutate: signOut, isSuccess} = useSignOutAccout();
    const {user} = useUserContext();
    const {data: currentUser} = useGetCurrentUserCollection(user.accountid, user.role);
    return (
    <div>
        {open?(
            <nav className='rightsidebar'>
            <div className='flex flex-col gap-11'>
                <Button onClick={()=>setOpen(false)}>
                    <img 
                     src="/assets/cross.png"
                     alt=""
                     width={40}
                     className={`invert-white`}/>
                </Button>
                <Link to={`/profile/${user.accountid}`} className='flex gap-3 items-center'>
                    <img 
                    src={currentUser?.imageUrl || `https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=338&ext=jpg&ga=GA1.1.2082370165.1710547200&semt=ais`}
                    alt="profile"
                    className='h-14 w-14 rounded-full'
                    />
                    <div className='flex flex-col'>
                        <p className='small-regular text-light-3'>
                           {currentUser?.username}
                        </p>
                    </div>
                    </Link>
                    <ul className='flex flex-col gap-6'>
                        <li className={`leftsidebar-link group`}>
                            <NavLink
                            to={`/edit-email-password/${user.accountid}`}
                            className="flex gap-4 items-center p-1">
                                <img 
                                src="/assets/edit2.png"
                                alt=""
                                width={35}
                                className={`invert-white`}/>
                                Update email and password
                            </NavLink>
                        </li>
                        {user.role == "student"?(
                            <li className={`leftsidebar-link group`}>
                            <Button
                            onClick={()=>navigate(`/edit-profile`)}
                            className="flex gap-4 items-center p-1">
                                <img 
                                src="/assets/activity.png"
                                alt=""
                                width={40}
                                className={`invert-white`}/>
                                <p>Activities</p>
                            </Button>
                        </li>
                        ):(
                            <></>
                        )}
                        <li className={`leftsidebar-link group`}>
                            <Button
                            onClick={()=>navigate(`/edit-profile/${user.accountid}`)}
                            className="flex gap-4 items-center p-1">
                                <img 
                                src="/assets/edit.png"
                                alt=""
                                width={37}
                                className={`invert-white`}/>
                                <p>Edit profile</p>
                            </Button>
                        </li>
                </ul>
            </div>
            </nav>
        ):(
            <Button onClick={()=>setOpen(true)} className="hidden md:flex px-6 py-10 flex-col">
                <div className="m-5">
                <img 
                     src="/assets/menu.png"
                     alt=""
                     width={40}
                     className='invert-white'/>
                </div>
            </Button>
        )}
    </div>
  )
}

export default RightBar