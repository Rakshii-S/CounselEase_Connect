import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import {sidebarLinksAdmin, sidebarLinksBuddy, sidebarLinksCounsellor, sidebarLinksStudent} from '../../../constants/index.ts'
import {INavLink} from '../../../types/index.ts'
import { useSignOutAccout } from "../../../@/lib/react_query/queryNmutation.tsx";
import { useUserContext } from "../../../context/AuthContext.tsx";
import { Button } from "../../../@/components/ui/button.tsx";
function LeftBar() 
{
    const {pathname} = useLocation();
    const {user} = useUserContext();
    const {mutate: signOut, isSuccess} = useSignOutAccout();
    const navigate = useNavigate();

    useEffect(()=>{
        if(isSuccess) navigate(0);
    },[isSuccess])
    return (
    <nav className='leftsidebar'>
        <div className='flex flex-col gap-11'>
            <Link to="/" className='flex gap-3 items-center'>
                <img 
                    src="/assets/mainlogo.png"
                    alt="logo"
                    width={60}
                    height={36}
                />
                <p className="text-xl">CounselEase Connect</p>
            </Link>
                <ul className='flex flex-col gap-6'>
               {user.role == "admin" && sidebarLinksAdmin .map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                    <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                        <NavLink
                        to={link.route}
                        className="flex gap-4 items-center p-1">
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={40}
                            className={`invert-white $ {isActive && 'invert-white'}`}/>
                            {link.label}
                        </NavLink>
                    </li>
                )
               })}
               {user.role == "counsellor" && sidebarLinksCounsellor .map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                    <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                        <NavLink
                        to={link.route}
                        className="flex gap-4 items-center p-1">
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={40}
                            className={`invert-white $ {isActive && 'invert-white'}`}/>
                            {link.label}
                        </NavLink>
                    </li>
                )
               })}
               {user.role == "student" && sidebarLinksStudent .map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                    <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                        <NavLink
                        to={link.route}
                        className="flex gap-4 items-center p-1">
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={40}
                            className={`invert-white $ {isActive && 'invert-white'}`}/>
                            {link.label}
                        </NavLink>
                    </li>
                )
               })}
               {user.role == "buddy" && sidebarLinksBuddy .map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                    <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                        <NavLink
                        to={link.route}
                        className="flex gap-4 items-center p-1">
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={40}
                            className={`invert-white $ {isActive && 'invert-white'}`}/>
                            {link.label}
                        </NavLink>
                    </li>
                )
               })}
            </ul>
        </div>
        <Button className='flex ml-[-160px] mt-8 items-center' onClick={()=>signOut()}>
                <img 
                src='assets/logout.png'
                alt="logout"
                width={38}
                className={`invert-white`}
                />
                <p className="ml-3 text-bold">Logout</p>
        </Button>
        </nav>
  )
}

export default LeftBar