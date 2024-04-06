import { Button } from '../../../@/components/ui/button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetBuddyByIdU, useGetRecentBuddyB, useGetRecentBuddyU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';
import { useUserContext } from '../../../context/AuthContext';
import { Toast } from '@radix-ui/react-toast';
import { DeleteUser } from '../../../@/lib/appwrite/api';

function Buddy() {
  //constants
  const {user} = useUserContext()
  const navigate = useNavigate();

  //tanstack query and appwrite 
  const {data:usersU, isPending : isUserLoading1} = useGetRecentBuddyU();
  const {data:usersB, isPending : isUserLoading2} = useGetRecentBuddyB();

  return (
    <>
    <div className="common-container">
      <Toast/>
      {user.role == "admin"?(
        <div className='bg-gray-900 w-full h-24 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-between'>
          <p>Add new Buddy</p>
          <Link to="/add-buddy">
            <img
            src="/assets/plus.png"
            width={40}
            />
          </Link>
        </div>
      ):(
        <div className='h3-bold md:h2-bold text-left w-full'>
          <p>Buddy profiles</p>
        </div>
      )}
        {isUserLoading1 && isUserLoading2 && !usersU && !usersB?(
              <Loader/>
            ):(<ul>
              <div className=' flex flex-row flex-wrap items-center gap-5 overflow-y py-2 px-2 md:px-4 lg:p-4 '>
                  {(usersU?.documents || []).filter(userU => userU.role === "buddy").map((userU: Models.Document, index: number) => (
                    <div key={userU.id}>
                      {usersB?.documents && index < usersB.documents.length && (
                        <>
                        <div className='lg:w-[350px] lg:h-[350px] md:w-[400px] md:h-[350px]  h-[350px] w-[400px] p-6 bg-gray-900 rounded-3xl flex flex-row m-4'>
                            <Link to={`/view-buddy/${userU.$id}`} className='mt-8'>
                                  <img
                                    src={usersB.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                    alt="profile"
                                    className='w-56 rounded-full'
                                    />
                            </Link>
                            <div className='mt-10'>
                              {user.role == "admin"?(
                                <>
                                  <Button className=' ml-36 mt-[-20px]' onClick={()=> DeleteUser(userU.$id, userU.role)} >
                                    <img
                                    src="/assets/trash.png"
                                    width={25}
                                    alt="edit"
                                    />
                                  </Button>
                                  <Button onClick={()=>navigate(`/edit-buddy/${userU.$id}`)} className='ml-36'>
                                    <img
                                    src="/assets/edit.png"
                                    width={20}
                                    alt="edit"
                                    />
                                  </Button>
                                </>
                              ):(
                                <></>
                              )}
                                  <div className='pl-10 mt-6 text-xl'>{usersB.documents[index].username}</div>
                                  <div className='pl-10 mt-2 text-light text-gray-500'>{userU.role}</div>
                            </div>
                      </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
              </ul>)}
    </div>
    </>
  )
}

export default Buddy