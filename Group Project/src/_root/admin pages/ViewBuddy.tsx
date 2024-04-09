import { Button } from '../../../@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetBuddyByIdB, useGetBuddyByIdU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { DeleteUser } from '../../../@/lib/appwrite/api';
import { useUserContext } from '../../../context/AuthContext';


function ViewBuddy() {
  //hooks and others
  const navigate = useNavigate();
  const {id} = useParams()

   //tanstack query, appwrite and context 
  const {user} = useUserContext()
  const {data: userU, isPending: isUserU} = useGetBuddyByIdU(id || '');
  const {data: userB, isPending: isUserB} = useGetBuddyByIdB(id || '');
  
  
  const deleteUser = async () =>{
    await DeleteUser(userU?.accountid, userU?.role, userB?.imageid);
  }
  
  return (
    <div className="post_details-container">
        {isUserU && isUserB?(<Loader/>):(
          <>
        <div className='bg-slate-900 w-full h-[2000px]  rounded-xl  flex flex-col md:flex-col lg:flex-row p-10'>
            <img
            src={userB?.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
            alt="profile"
            className='m-10 w-48 rounded-full h-48'
            />
            <div className='p-4'>
                <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Name:</p>
                <p className='pl-3 pt-5'>{userB?.username}</p>
              </div>
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Email:</p>
                <p className='pl-3 pt-5'>{userU?.email}</p>
              </div>
              {user.role == "admin"?(
                  <div className='flex flex-row text-xl'>
                  <p className='pl-10 pt-5 pr-5'>Password:</p>
                  <p className='pl-3 pt-5'>{userU?.password}</p>
                </div>
              ):(
                <></>
              )}
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Role:</p>
                <p className='pl-3 pt-5'>{userU?.role}</p>
              </div>
              <div className='flex flex-row text-xl'>
                <p className='pl-10 pt-5 pr-5'>Bio:</p>
                <p className='pl-3 pt-5'>{userB?.bio}</p>
              </div>
              <div className='flex flex-row text-xl pb-24'>
                <p className='pl-10 pt-5 pr-5'>Contact:</p>
                <p className='pl-3 pt-5'>{userB?.contact}</p>
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
        <Button onClick={()=>navigate("/buddy")} className="bg-sky-800 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
        </>
        )}
    </div>
  )
}

export default ViewBuddy

