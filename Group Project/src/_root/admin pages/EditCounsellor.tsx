import { useParams } from 'react-router-dom';
import { useGetCounsellorByIdC, useGetCounsellorByIdU } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';
import CounsellorForm from './CounsellorForm';

function EditCounsellor() {
  //hooks and others 
  const {id} = useParams();

  //tanstack query and appwrite 
  const {data:userU, isPending: isuserU} = useGetCounsellorByIdU(id || '');
  const {data:userC, isPending: isuserC} = useGetCounsellorByIdC(id || '');

  if(isuserU && isuserC) return (
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
        <p className="p-2 mt-4 text-xl">Edit Counsellor</p>
      </div>
      <CounsellorForm action="Update" counsellorU={userU} counsellorC={userC}/>
  </div>
  )
}

export default EditCounsellor