import { useNavigate } from "react-router-dom";
import { useToast } from "../../../@/components/ui/use-toast";
import { useGetCurrentUserCollection, useUpdateAccount, useUpdateUserEmail, useUpdateUserPassword } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";

function EditEmail_password() {
    //constants
   const {toast} = useToast();
   const navigate = useNavigate();

    //tanstack query, appwrite and context 
   const {user} = useUserContext();
   const {data: currentUser, isLoading} = useGetCurrentUserCollection(user.accountid, user.role);
   const {mutateAsync: UpdateEmail, isPending: isLoadingEmail} = useUpdateUserEmail();
   const {mutateAsync: UpdatePassword, isPending: isLoadingPassword} = useUpdateUserPassword();

   //email update
 const emailUpdate = (event:any) =>
 {
   event.preventDefault();
   UpdateEmail({
     $id: currentUser?.$id,
     role: user?.role,
     userId: currentUser?.accountid,
     block: currentUser?.block,
     imageid: currentUser?.imageid,
     userid: currentUser?.accountid,
     imageUrl: currentUser?.imageUrl,
     password: user.password,
     email: event.target.emailVal.value,
     file: [],
     contact: currentUser?.contact,
     username: currentUser?.username,
     bio: currentUser?.bio,
     newPassword: ""
   });
   toast({title:'Email Updated successfully'})
 }

 //password update
 const passwordUpdate=(event:any) =>{
   event.preventDefault();
   UpdatePassword({
     $id: currentUser?.$id,
     role: user?.role,
     userId: currentUser?.accountid,
     block: currentUser?.block,
     imageid: currentUser?.imageid,
     userid: currentUser?.accountid,
     imageUrl: currentUser?.imageUrl,
     password: user.password,
     email: user.email,
     file: [],
     contact: currentUser?.contact,
     username: currentUser?.username,
     bio: currentUser?.bio,
     newPassword: event.target.passVal.value
   });
   toast({title:'Email Updated successfully'})
 }

  return (
    <div  className="common-container">
        <div className="flex h-18">
            <img
            src="/assets/edit2.png"
            alt="add user"
            width={50}
            height={50}
            className="pr-2"
            />
            <p className="p-2 mt-4 text-xl">Update credetials</p>
        </div>
        <div>
          {/*Update email*/}
        <form className='flex flex-col w-full' onSubmit={emailUpdate} >
            <p className='m-2'>Update Email</p>
              <input type="email"  
              required  
              name="emailVal"
              placeholder={user.email}
              className="bg-slate-900 m-2 p-4 mb-4 rounded-xl h-14" />
              <input type="submit" 
              value={`${isLoadingEmail?(
                "Loading....."
            ):("Update Email"
            )}`} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl h-14 "/>
        </form>

        {/*Update password */}
        <form className='flex flex-col w-full mt-14' onSubmit={passwordUpdate} >
           <p className='m-2'>Update password</p>
            <input type="password"  
            required  
            name="passVal"
            className="bg-slate-900 m-2 p-4 mb-4 rounded-xl h-14"
            placeholder={user.password} />
            <input type="submit" 
              value={`${isLoadingPassword?(
                "Loading....."
            ):("Update Password"
            )}`} className="bg-sky-800 m-2 p-4 mb-10 rounded-xl h-14 "/>
        </form>
    </div>
    </div>
  )
}

export default EditEmail_password