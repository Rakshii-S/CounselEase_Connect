import { Button } from '../../../@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useGetRecentGroup } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';


function Group() {
  //hooks and others
  const navigate = useNavigate();

  //tanstack query and appwrite 
  const {data:groups, isPending : isGroupLoading} = useGetRecentGroup();
  
  return (
    <>
    <div className='common-container'>
    <div className='flex flex-row justify-between h3-bold md:h3-bold text-left w-full'>
        <p>Create a new group</p>
      <Link to="/create-group">
        <img
        src="/assets/plus.png"
        width={50}
        className='mt-[-15px]'
        />
      </Link>
    </div>
    {isGroupLoading && !groups?(
              <Loader/>
            ):(<ul className="flex flex-1 flex-col w-full ml-[-50px]">
                  {groups?.documents.map((group: Models.Document) => (
                    <div className='bg-gray-900 m-5 w-full h-32 rounded-3xl flex flex-row justify-between'>
                    <div className='p-4 flex flex-row'>
                        <img
                            src={group.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                            alt="group"
                            className='w-24 h-24 ml-2 rounded-full'
                        />
                        <p className='p-8 text-base'>{group.name}</p>
                    </div>
                    <div className='p-4 mt-4'>
                        <Button onClick={()=>navigate(`/view-group/${group.$id}`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-20 h-14 ">View</Button>
                    </div>
                </div>
                  ))}
              </ul>
              )
    }
    </div>
    </>
  )
}

export default Group