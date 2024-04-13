import { Button } from '../../../@/components/ui/button'
import { Link, useNavigate} from 'react-router-dom'
import { useGetRecentBuddyB, useGetRecentBuddyU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';
import { useUserContext } from '../../../context/AuthContext';
import { Toast } from '@radix-ui/react-toast';
import { DeleteUser } from '../../../@/lib/appwrite/api';

function Buddy() {
  //hooks and others
  const {user} = useUserContext()
  const navigate = useNavigate();

  //tanstack query and appwrite 
  const {data:usersU, isPending : isUserLoading1} = useGetRecentBuddyU();
  const {data:usersB, isPending : isUserLoading2} = useGetRecentBuddyB();

  return (
    <>
    <div className='flex flex-1'>
    <div className="home-container">
      <Toast/>
      {user.role == "admin"?(
        <div className='flex flex-row justify-between h3-bold md:h3-bold text-left w-full'>
        <p>Add new buddy</p>
          <Link to="/add-buddy">
            <img
            src="/assets/plus.png"
            width={40}
            />
          </Link>
        </div>
      ):(
        <div className='h3-bold md:h3-bold text-left w-full'>
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
                        <div className='lg:w-[350px] lg:h-[240px] md:w-[400px] md:h-[240px]  h-[240px] w-[300px] p-6 bg-gray-900 rounded-3xl flex flex-row ml-10 mt-6'>
                            <Link to={`/view-buddy/${userU.$id}`} className='mt-8'>
                                  <img
                                    src={usersB.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                    alt="profile"
                                    width={120}
                                    className='rounded-full'
                                    />
                            </Link>
                            <div className=''>
                              {user.role == "admin"?(
                                <>
                                <div className='flex flex-row'>
                                  <Button className='ml-10' onClick={()=> DeleteUser(userU.$id, userU.role,usersB.documents[index].imageid)} >
                                    <img
                                    src="/assets/trash.png"
                                    width={25}
                                    alt="edit"
                                    />
                                  </Button>
                                  <Button onClick={()=>navigate(`/edit-buddy/${userU.$id}`)} className=''>
                                    <img
                                    src="/assets/edit.png"
                                    width={17}
                                    alt="edit"
                                    />
                                  </Button>
                                  </div>
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
    </div>
    </>
  )
}

export default Buddy