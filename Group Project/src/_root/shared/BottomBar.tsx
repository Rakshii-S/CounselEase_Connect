
import {Link, NavLink, useLocation} from 'react-router-dom'
import { AdminbottombarLinks, BuddybottombarLink, CounsellorbottombarLink, StudentbottombarLink } from '../../../constants';
import { INavLink } from '../../../types';
import { useUserContext } from '../../../context/AuthContext';

function BottomBar() {
  const {pathname} = useLocation();
  const {user} = useUserContext()
  return (
    <section className='bottom-bar'>
               { user.role == "admin" && AdminbottombarLinks.map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                        <NavLink
                        to={link.route}
                        key={link.label} className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={30}
                            height={20}
                            className={`$ {isActive && 'invert-white'} invert-white`}/>
                            <p className='tiny-medium text-light-2'>{link.label}</p>
                        </NavLink>
                )
               })}
               { user.role == "counsellor" && CounsellorbottombarLink.map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                        <NavLink
                        to={link.route}
                        key={link.label} className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={30}
                            height={20}
                            className={`$ {isActive && 'invert-white'} invert-white`}/>
                            <p className='tiny-medium text-light-2'>{link.label}</p>
                        </NavLink>
                )
               })}
               { user.role == "student" && StudentbottombarLink.map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                        <NavLink
                        to={link.route}
                        key={link.label} className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={30}
                            height={20}
                            className={`$ {isActive && 'invert-white'} invert-white`}/>
                            <p className='tiny-medium text-light-2'>{link.label}</p>
                        </NavLink>
                )
               })}
               { user.role == "buddy" && BuddybottombarLink.map((link:INavLink) =>{
                const isActive = pathname === link.route;
                return (
                        <NavLink
                        to={link.route}
                        key={link.label} className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>
                            <img 
                            src={link.imgURL}
                            alt={link.label}
                            width={30}
                            height={20}
                            className={`$ {isActive && 'invert-white'} invert-white`}/>
                            <p className='tiny-medium text-light-2'>{link.label}</p>
                        </NavLink>
                )
               })}
    </section>
  )
}

export default BottomBar