import { Button } from '../../../@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCounsellorByIdC, useGetCounsellorByIdU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { useUserContext } from '../../../context/AuthContext';
import { DeleteUser } from '../../../@/lib/appwrite/api';


function ViewCounsellor() {
  //hooks and others
  const navigate = useNavigate();
  const {id} = useParams()

   //tanstack query, appwrite and context 
   const {user} = useUserContext()
  const {data: userU, isPending: isUserU} = useGetCounsellorByIdU(id || '');
  const {data: userC, isPending: isUserC} = useGetCounsellorByIdC(id || '');

  const deleteUser = async () =>{
    await  DeleteUser(userU?.accountid, userU?.role,userC?.imageid);
  }
    
  return (
    <div className="post_details-container">
        {isUserU && isUserC?(<Loader/>):(
          <>
            <div className='bg-slate-900 w-full h-full rounded-xl flex flex-col md:flex-row p-10 items-center md:justify-evenly'>
            <img
            src={userC?.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
            alt="profile"
            width={150}
            className='ml-10 mr-10 rounded-full md:w-56 md:h-56'
            />
            <div className='p-4 md:pt-10'>
                <div className='text-xl text-center'>
                <p>{userC?.username}</p>
              </div>
              <div className='text-lg text-light-3 text-center'>
                <p className='pt-3'>{userU?.email}</p>
              </div>
              <div className='text-lg text-light-3 text-center'>
                <p className='pt-2'>{userU?.role}</p>
              </div>
              <div className='border m-4 text-xl text-center'>
                <p className='pt-6 text-base'><u>BIO</u></p>
                <p className='pt-2 p-6 text-base'>{userC?.bio}</p>
              </div>
              <div className='flex flex-row pb-24'>
                <img
                src="/assets/contact.png"
                className='w-8 h-8 invert-white mt-4 mr-3'/>
                <p className='pt-5 pr-5 text-lg'>Contact</p>
                <p className='pl-1 pt-5 text-lg'>{userC?.contact}</p>
              </div>
              {user.role == "admin"?(
                  <div className='flex flex-row text-xl'>
                  <p className='pt-5 pr-5 text-lg'>Password</p>
                  <p className='pl-1 pt-5 text-lg'>{userU?.password}</p>
                </div>
              ):(
                <></>
              )}
            </div>
        </div>
        {user.role == "admin"?(
              <>
                <Button onClick={deleteUser}className="bg-sky-800 p-4 mb-2 rounded-xl w-40 h-12">Delete Account</Button>
              </>
            ):(
              <></>
            )}
        <Button onClick={()=>navigate("/counsellor")} className="bg-sky-800 p-4 mb-10 rounded-xl w-40 h-12">Go Back</Button>
        </>
        )}
    </div>
  )
}

export default ViewCounsellor

