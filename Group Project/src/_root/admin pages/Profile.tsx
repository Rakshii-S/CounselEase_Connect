import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../@/components/ui/button';
import { useGetCurrentUserCollection } from '../../../@/lib/react_query/queryNmutation';
import { multiFormatDateString } from '../../../@/lib/utils';
import Loader from '../shared/Loader';
import { Models } from 'appwrite';
import { useUserContext } from '../../../context/AuthContext';

type props=
{
    user: Models.Document;
}
function Profile() 
{
    //hooks and others
    const navigate = useNavigate();
    const {id} = useParams();
     
    //tanstack query, appwrite and context 
    const {user} = useUserContext();
    const {data: currentUser, isLoading} = useGetCurrentUserCollection(id || '', user.role);
    if(isLoading) return (
      <div className='m-[400px]'>
         <Loader/>
      </div>
    )
    return (
    <div  className="common-container">
        <div className='bg-slate-900 flex lg:flex-row flex-col rounded-xl h-full w-full mt-24'>
                <center>
                <img 
                    src={currentUser?.imageUrl || ``} 
                    alt="profile" 
                    className='rounded-full w-56 h-56 m-10 '
                />
                </center>
            <div className='lg:mt-20 lg:ml-28'>
                <div>
                    <p className='text-center text-light-3'>Joined: {multiFormatDateString(currentUser?.$createdAt)}</p>
                    <p className='text-center text-light-3'>{currentUser?.username}</p>
                    <p  className='text-center text-light-3 p-2'>{user.email}</p>
                </div>
                <div className='border m-4 mb-8 text-xl text-center'>
                <p className='pt-6 text-base'><u>BIO</u></p>
                <p className='pt-2 p-6 text-base'>{currentUser?.bio}</p>
              </div>
            </div>
        </div>   
        <div className='flex lg:flex-row justify-between flex-col'>
            {user.accountid == currentUser?.$id? (
                <>
                <Button onClick={()=>navigate(`/edit-profile/${user.accountid}`)} className="bg-sky-800 m-2 p-4 mb-6 rounded-xl w-40 h-12 lg:hidden md:hidden visible">Edit profile</Button>
                <Button 
                onClick={()=>navigate('/')} 
                className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-40 h-12">Go Back</Button>
                </>
            ):(
                <>
                <Button 
                onClick={()=>navigate(`/mgroups`)} 
                className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
                </>
            )}
        </div>
    </div>
    )
}

export default Profile