import React from 'react'
import { Button } from '../../../@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCounsellorByIdC, useGetCounsellorByIdU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { useUserContext } from '../../../context/AuthContext';
import { useToast } from '../../../@/components/ui/use-toast';
import { DeleteUser } from '../../../@/lib/appwrite/api';


function ViewCounsellor() {
  const navigate = useNavigate();
  const {user} = useUserContext()
  const {id} = useParams()
  const {toast} = useToast();
  const {data: userU, isPending: isUserU} = useGetCounsellorByIdU(id || '');
  const {data: userC, isPending: isUserC} = useGetCounsellorByIdC(id || '');

  //
  const deleteUser = async () =>{
    const status =  DeleteUser(userU?.accountid, userU?.role);
    if(await status)
    {
    alert("Account deleted sucessfully.")
    navigate('/buddy')
      toast({title:'Account deleted successfully'})
    }
  }
    
  return (
    <div className="post_details-container">
        {isUserU && isUserC?(<Loader/>):(
          <>
        <div className='bg-slate-900 w-full h-[2000px]  rounded-xl  flex flex-col md:flex-col lg:flex-row p-10'>
            <img
            src={userC?.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
            alt="profile"
            className='m-10 w-48 rounded-full h-48'
            />
            <div className='p-4'>
                <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Name:</p>
                <p className='pl-3 pt-5'>{userC?.username}</p>
              </div>
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Email:</p>
                <p className='pl-3 pt-5'>{userU?.email}</p>
              </div>
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Password:</p>
                <p className='pl-3 pt-5'>{userU?.password}</p>
              </div>
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Role:</p>
                <p className='pl-3 pt-5'>{userU?.role}</p>
              </div>
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Bio:</p>
                <p className='pl-3 pt-5'>{userC?.bio}</p>
              </div>
              <div className='flex flex-row text-xl pb-24'>
                <p className='pl-10 pt-5 pr-5'>Contact:</p>
                <p className='pl-3 pt-5'>{userC?.contact}</p>
              </div>
            </div>
        </div>
        {user.role == "admin"?(
              <>
                <Button onClick={deleteUser} className="bg-sky-800 p-4 mb-2 rounded-xl w-56 h-18">Delete Account</Button>
              </>
            ):(
              <></>
            )}
        <Button onClick={()=>navigate("/counsellor")} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
        </>
        )}
    </div>
  )
}

export default ViewCounsellor

