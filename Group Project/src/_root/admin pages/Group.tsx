import { Button } from '../../../@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useGetRecentGroup } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';


function Group() {
  const navigate = useNavigate();

  //tanstack query and appwrite 
  const {data:groups, isPending : isGroupLoading} = useGetRecentGroup();
  return (
    <>
    <div className='common-container'>
    <div className='bg-gray-900 w-full h-28 text-2xl rounded-2xl p-8 pl-10 pr-10 flex flex-row justify-between'>
      <p>Create a group</p>
      <Link to="/create-group">
        <img
        src="/assets/plus.png"
        width={60}
        className='mt-[-15px]'
        />
      </Link>
    </div>
    {isGroupLoading && !groups?(
              <Loader/>
            ):(<ul className="flex flex-1 flex-col w-full ml-[-50px]">
                  {groups?.documents.map((group: Models.Document) => (
                    <div className='bg-gray-900 m-5 w-full h-44 rounded-3xl flex flex-row justify-between'>
                    <div className='p-8 flex flex-row'>
                        <img
                            src={group.imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                            alt="group"
                            width={120}
                            className='rounded-full'
                        />
                        <p className='p-10'>{group.name}</p>
                    </div>
                    <div className='mt-4 p-10'>
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