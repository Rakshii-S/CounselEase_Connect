import { useParams } from 'react-router-dom';
import GroupForm from './GroupForm'
import { useGetGroupById } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';

function EditGroups() {
  const {id} = useParams();
  const {data:group, isPending} = useGetGroupById(id || '');

  if(isPending) return (
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
        <p className="p-2 mt-4 text-xl">Edit group</p>
      </div>
      <GroupForm action="Update" group={group}/>
  </div>
  )
}

export default EditGroups