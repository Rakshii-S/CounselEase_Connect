import {Navigate, Outlet} from 'react-router-dom';
import { Toaster } from '../../@/components/ui/toaster';
import { useUserContext } from '../../context/AuthContext';
import RootLayout from '../_root/RootLayout';

function AuthLayout() {
  const {user} = useUserContext();
  return (
    <>
      {user? (
        <>
        <section className='flex flex-1 justify-center items-center flex-col py-10'>
          <Outlet/>
          <Toaster/>
        </section>
        <img 
        src="/assets/banner.jpg"
        alt="logo"
        className='hidden xl:block h-full w-1/2 object-cover justify-end'
        />
        </>
      ):(
        <>
        <Navigate to="/login"/>
        </>
      )}
    </>
  )
}

export default AuthLayout