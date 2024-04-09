import { useParams } from 'react-router-dom';
import { useGetBuddyByIdB, useGetBuddyByIdU} from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import BuddyForm from './BuddyForm';

function EditBuddy() {
  //hooks and others 
  const {id} = useParams();

  //tanstack query and appwrite 
  const {data:userU, isPending: isUserU} = useGetBuddyByIdU(id || '');
  const {data:userB, isPending: isUserB} = useGetBuddyByIdB(id || '');

  if(isUserU && isUserB) return (
    <div className='m-[400px]'>
       <Loader/>
    </div>
  )
  return (
    <div  className="common-container">
    <div className="flex h-18">
        <img
        src="/assets/plus.png"
        alt="add user"
        width={80}
        className="pr-2"
        />
        <p className="p-2 mt-4 text-xl">Edit Buddy</p>
      </div>
      <BuddyForm action="Update" buddyU={userU} buddyB={userB}/>
  </div>
  )
}

export default EditBuddy