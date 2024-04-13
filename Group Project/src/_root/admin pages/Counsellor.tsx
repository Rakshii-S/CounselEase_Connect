import { Button } from '../../../@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useGetRecentCounsellorC, useGetRecentCounsellorU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';
import { useUserContext } from '../../../context/AuthContext';
import { DeleteUser } from '../../../@/lib/appwrite/api'; 

function Counsellor() {
  //hooks and others
  const {user} = useUserContext();
  const navigate = useNavigate();

  //tanstack query and appwrite 
  const {data:usersU, isPending : isUserLoading1} = useGetRecentCounsellorU();
  const {data:usersC, isPending : isUserLoading2} = useGetRecentCounsellorC();

  return (
    <>
    <div className="common-container">
      {user.role == "admin"?(
          <div className='flex flex-row justify-between h3-bold md:h3-bold text-left w-full'>
          <p>Add new counsellor</p>
          <Link to="/add-counsellor">
            <img
            src="/assets/plus.png"
            width={40}
            />
          </Link>
        </div>
      ):(
        <div className='h3-bold md:h3-bold text-left w-full'>
          <p>Counsellor profiles</p>
        </div>
      )}
        {isUserLoading1 && isUserLoading2 && !usersU && !usersC?(
              <Loader/>
            ):(<ul>
              <div className=' flex flex-row flex-wrap items-center gap-5 overflow-y py-2 px-2 md:px-4 lg:p-4 '>
                  {(usersU?.documents || []).filter(userU => userU.role === "counsellor").map((userU: Models.Document, index: number) => (
                    <div key={userU.id}>
                      {usersC?.documents && index < usersC.documents.length && (
                        <>
                        <div className='lg:w-[350px] lg:h-[240px] md:w-[400px] md:h-[240px]  h-[240px] w-[300px] p-6 bg-gray-900 rounded-3xl flex flex-row ml-10 mt-6'>
                            <Link to={`/view-counsellor/${userU.$id}`} className='mt-8'>
                                  <img
                                    src={usersC.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                    alt="profile"
                                    width={120}
                                    className='rounded-full'
                                    />
                            </Link>
                            <div className=''>
                              {user.role =="admin"?(
                                <>
                                <div className='flex flex-row'>
                                  <Button 
                                  onClick={()=> DeleteUser(userU.$id, userU.role,usersC.documents[index].imageid)} 
                                  className='ml-10'>
                                    <img
                                    src="/assets/trash.png"
                                    width={25}
                                    alt="edit"
                                    />
                                  </Button>
                                  <Button onClick={()=>navigate(`/edit-counsellor/${userU.$id}`)} className=''>
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
                                  <div className='pl-10 mt-6 text-xl'>{usersC.documents[index].username}</div>
                                  <div className='pl-10 mt-2 text-light text-gray-500'>{userU.role}</div>
                                  <div className='pl-8 mt-2 text-sm text-gray-500'>BLOCK: {usersC.documents[index].block}</div>
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

export default Counsellor