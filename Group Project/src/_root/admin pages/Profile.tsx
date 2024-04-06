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
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useUserContext();
    const {data: currentUser, isLoading} = useGetCurrentUserCollection(id || '', user.role);
    if(isLoading) return (
      <div className='m-[400px]'>
         <Loader/>
      </div>
    )
    return (
    <div  className="common-container">
        <div className='bg-slate-900 flex lg:flex-row flex-col rounded-xl w-full mt-24'>
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
                <div>
                        <p className='text-center p-2 pb-20'>Bio: {currentUser?.bio}</p>
                </div>
            </div>
        </div>   
        <div className='flex lg:flex-row justify-between flex-col'>
            {user.accountid == currentUser?.$id? (
                <>
                <Button onClick={()=>navigate(`/edit-profile/${user.accountid}`)} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18 lg:hidden md:hidden visible">Edit profile</Button>
                <Button 
                onClick={()=>navigate('/')} 
                className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Go Back</Button>
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