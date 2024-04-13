import { useNavigate } from "react-router-dom";
import { Button } from "../../../@/components/ui/button"
import { useGetRecentGroup } from "../../../@/lib/react_query/queryNmutation";
import Loader from "../shared/Loader";
import { Models } from "appwrite";
import { useState } from "react";
import { useUserContext } from "../../../context/AuthContext";

function MGroup() {
  //hooks and others
  const navigate = useNavigate();
  const {user} = useUserContext();
  const [Agroups , setAgroups] = useState(true);
  const [Jgroups , setJgroups] = useState(false);
  
  //tanstack query and appwrite 
  const {data:groups, isPending : isGroupLoading} = useGetRecentGroup();

  const allGroups = () =>
  {
    setAgroups(true);
    setJgroups(false);
  }

  const joinedGroups = () =>
  {
    setAgroups(false);
    setJgroups(true);
  }
  return (
    <>
    <div className="common-container">
    <div className='h3-bold md:h3-bold text-left w-full mb-[-40px]'>
                    <p>Group Feed</p>
    </div>
        <div className="w-full flex flex-row h-32 justify-between rounded-md">
        <Button 
            className={`mt-8 ml-4 lg:ml-24 mr-24 mb-10 h-16 p-4 rounded-xl bg-gray-900 hover:bg-slate-700 ${Jgroups && 'bg-gray-700'}`}
            onClick={joinedGroups}>
            Joined Groups
          </Button>
          <Button 
            className={`mt-8 ml-24 mr-24 mb-10 h-16 p-4 rounded-xl bg-gray-900 hover:bg-slate-700 ${Agroups && 'bg-gray-700'}`}
            onClick={allGroups}>
            Groups
          </Button>
        </div>
        <div className="flex flex-1 flex-col w-full ">
        {isGroupLoading && !groups?(
            <div className="common-container">
               <Loader/>
            </div>
            ):(<ul className="flex flex-1 flex-col gap-9 ">
                  {Jgroups && groups?.documents.map((group: Models.Document) => (
                    <>
                    {group?.studentId.includes(user.accountid) || group?.counsellorId == user.accountid || group?.buddyId == user.accountid?(
                        <div className='bg-gray-900 w-full h-32 rounded-3xl flex flex-row justify-between'>
                        <div className='pt-10 pl-8 text flex flex-row'>
                            <img
                                src={group.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                alt="group"
                                className='rounded-full w-16 h-16'
                            />
                            <p className='text-sm pl-4 pt-5'>{group.name}</p>
                        </div>
                        <div className='p-10'>
                            <Button onClick={()=>navigate(`/view-Mgroup/${group.$id}`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-24 h-12">View</Button>
                        </div>
                      </div>
                    ):(
                     <>
                     </>
                    )}
                  </>
                  ))}
                  {Agroups && groups?.documents.map((group: Models.Document) => (
                    <>
                    {!group?.studentId.includes(user.accountid)?(
                        <div className='bg-gray-900 ml-4 mr-4 w-auto h-32 rounded-3xl flex flex-row justify-between'>
                        <div className='pt-10 pl-8 text flex flex-row'>
                            <img
                                src={group.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                alt="group"
                                className='rounded-full w-16 h-16'
                            />
                            <p className='text-sm pl-4 pt-5'>{group.name}</p>
                        </div>
                        <div className='p-10'>
                            <Button onClick={()=>navigate(`/view-Mgroup/${group.$id}`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-24 h-12">View</Button>
                        </div>
                      </div>
                    ):(
                     <>
                     </>
                    )}
                  </>
                  ))}
              </ul>
              )
    }
        </div>
    </div>
    </>
  )
}

export default MGroup