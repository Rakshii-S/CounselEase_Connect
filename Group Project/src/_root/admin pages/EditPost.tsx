import { useParams } from 'react-router-dom';
import PostForm from './PostForm'
import Loader from '../shared/Loader';
import { useGetPostById } from '../../../@/lib/react_query/queryNmutation';

function EditPost() 
{
  //hooks and others
  const {id} = useParams();

   //tanstack query, appwrite and context 
  const {data:post, isPending} = useGetPostById(id || '');

  if(isPending) return (
    <div className='m-[400px]'>
       <Loader/>
    </div>
  )

  return (
    <>
      <div  className="common-container">
        <div className="flex h-18">
            <img
            src="/assets/plus.png"
            alt="add user"
            width={80}
            className="pr-2"
            />
            <p className="p-2 mt-4 text-xl">Edit the post</p>
          </div>
          <PostForm action="Update" post={post}/>
      </div>
    </>
  )
}

export default EditPost