import { useNavigate } from "react-router-dom";
import { Button } from "../../../@/components/ui/button"
import { useGetRecentGroup } from "../../../@/lib/react_query/queryNmutation";
import Loader from "../shared/Loader";
import { Models } from "appwrite";
import { useState } from "react";
import { useUserContext } from "../../../context/AuthContext";

function MGroup() {
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
        <div className="w-full bg-gray-900 flex flex-row justify-between">
          <Button 
            className={`mt-16 ml-4 lg:ml-24 mr-24 mb-10 h-16 p-4 rounded-xl hover:bg-slate-800 bg-black `}
            onClick={allGroups}>
            Groups
          </Button>
          <Button 
            className="mt-16 ml-24 mr-24 mb-10 h-16 p-4 rounded-xl bg-black hover:bg-slate-800"
            onClick={joinedGroups}>
            Joined Groups
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center">
        {isGroupLoading && !groups?(
              <Loader/>
            ):(<ul className="flex flex-1 flex-col gap-9 w-full">
                  {Agroups && groups?.documents.map((group: Models.Document) => (
                    <>
                    {!group?.studentId.includes(user.accountid)?(
                        <div className='bg-gray-900 ml-4 mr-4 w-auto h-44 rounded-3xl flex flex-row justify-between'>
                        <div className='p-8 text flex flex-row'>
                            <img
                                src={group.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                alt="group"
                                className='rounded-full w-20 h-20'
                            />
                            <p className='p-10'>{group.name}</p>
                        </div>
                        <div className='p-10'>
                            <Button onClick={()=>navigate(`/view-Mgroup/${group.$id}`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-20 h-14">View</Button>
                        </div>
                      </div>
                    ):(
                     <>
                     </>
                    )}
                  </>
                  ))}
                  {Jgroups && groups?.documents.map((group: Models.Document) => (
                    <>
                    {group?.studentId.includes(user.accountid) || group?.counsellorId == user.accountid || group?.buddyId == user.accountid?(
                        <div className='bg-gray-900 ml-4 mr-4 w-auto h-44 rounded-3xl flex flex-row justify-between'>
                        <div className='p-8 text flex flex-row'>
                            <img
                                src={group.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                                alt="group"
                                className='rounded-full w-20 h-20'
                            />
                            <p className='p-10'>{group.name}</p>
                        </div>
                        <div className='p-10'>
                            <Button onClick={()=>navigate(`/view-Mgroup/${group.$id}`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-32 h-20">View</Button>
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