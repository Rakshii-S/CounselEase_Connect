import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../@/components/ui/button';
import { useDeleteSummary, useGetSummarybyId, useUpdateSummary } from '../../../@/lib/react_query/queryNmutation';
import Loader from '../shared/Loader';

function ViewSummary() {
  const navigate = useNavigate()
  const {id} = useParams()
  let idSummary:string = String(id)
  const [value, setValue] = useState('');
  let time = new Date();
  time.setDate(time.getDate() + 0);
  const {data: summary} = useGetSummarybyId(id || '');
  const {mutateAsync: deleteSummary, isPending: isLoadingUpdate2} = useDeleteSummary();
  const {mutateAsync: updateSummary, isPending: isLoadingUpdate} = useUpdateSummary();
  async function uploadSummary ()
  {
    await updateSummary({
         idd: idSummary,
         counsellorid: '',
         studentid: '',
         studentcode: '',
         summary: value,
         regno: '',
         email: '',
         name: ''
     })
  }

  async function deleteS() {
    await deleteSummary(idSummary);
    navigate('/summary')
  }
  return(
    <div className='common-container'>
        <div className='h3-bold md:h3-bold text-left w-full'>
                    <p>Register number : {summary?.regno}</p>
        </div>
        <ReactQuill
          theme="snow" 
          value={value || summary?.summary} 
          onChange={setValue}
          className='h-[500px] w-full text-white' />
          <div className='flex flex-row justify-between w-full'>
            <Button 
              onClick={()=> navigate(`/summary`)} 
              className="bg-sky-800 m-2 p-4 mt-10 rounded-xl w-32 h-14">
              Go back
            </Button>
            <Button 
              onClick={deleteS} 
              className="bg-sky-800 m-2 p-4 mt-10 rounded-xl w-32 h-14">
              {isLoadingUpdate2?
              (
                <div className="pl-10 pt-[-30px]">
                <Loader/>
              </div>
              ):(
                "Delete"
              )}
            </Button>
            <Button 
              onClick={uploadSummary} 
              className="bg-sky-800 m-2 p-4 mt-10 rounded-xl w-32 h-14">
              {isLoadingUpdate?
              (
                <div className="pl-10 pt-[-30px]">
                <Loader/>
              </div>
              ):(
                "Update"
              )}
            </Button>
          </div>
    </div>
  )
}

export default ViewSummary
