import { Button } from '../../../@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useGetRecentCounsellorC, useGetRecentCounsellorU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';
import { useUserContext } from '../../../context/AuthContext';

function AppointmentDisplay() {
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
          <div className='bg-gray-900 w-full h-24 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-between'>
          <p>Add new Counsellor</p>
          <Link to="/add-counsellor">
            <img
            src="/assets/plus.png"
            width={40}
            />
          </Link>
        </div>
      ):(
        <div className='h3-bold md:h2-bold text-left w-full'>
          <p>Counsellor profiles</p>
        </div>
      )}
        {isUserLoading1 && isUserLoading2 && !usersU && !usersC?(
              <Loader/>
            ):(<ul>
              <div className=' flex flex-col flex-wrap items-center overflow-y py-2 px-2 md:px-4 lg:p-4 '>
                  {(usersU?.documents || []).filter(userU => userU.role === "counsellor").map((userU: Models.Document, index: number) => (
                    <div key={userU.id}>
                      {usersC?.documents && index < usersC.documents.length && (
                        <>
                        <div className='lg:w-[800px] md:w-[500px] h-[100px] w-[400px] p-6 bg-gray-900 rounded-3xl flex flex-row m-4'>
                                  <img
                                    src={usersC.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                    alt="profile"
                                    className='w-16 h-16 rounded-full'
                                    />
                            <div className='flex flex-row justify-between w-full'>
                                  <div className='pl-6 text-md mt-4'>{usersC.documents[index].username}</div>
                                  <Button onClick={()=>navigate(`/view-appointment/${userU.accountid}`)} className="bg-sky-800 rounded-xl p-4 w-26 h-14 pb-4">
                                   Book an appointment
                                  </Button>
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

export default AppointmentDisplay