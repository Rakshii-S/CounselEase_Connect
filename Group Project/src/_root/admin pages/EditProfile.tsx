import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../shared/Loader';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../@/components/ui/form';
import { Input } from '../../../@/components/ui/input';
import FileUploader from '../shared/FileUploader';
import { Button } from '../../../@/components/ui/button';
import { z } from 'zod';
import { useToast } from '../../../@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCurrentUserCollection, useUpdateAccount} from '../../../@/lib/react_query/queryNmutation';
import { useUserContext } from '../../../context/AuthContext';

//form validation by zod
export const AddUserToDB = z.object({
  contact: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  bio: z.string().min(5).max(3000),
  username:z.string().min(5).max(3000),
})

function EditProfile() {
   //constants
   const {toast} = useToast();
   const navigate = useNavigate();
 
   //tanstack query, appwrite and context 
   const {user} = useUserContext();
   const {data: currentUser, isLoading} = useGetCurrentUserCollection(user.accountid, user.role);
   const {mutateAsync: updateAccount, isPending: isLoadingUpdate} = useUpdateAccount();
  
   console.log(currentUser)
   // 1. Define your form.
   const form = useForm<z.infer<typeof AddUserToDB>>({
     resolver: zodResolver(AddUserToDB),
     defaultValues: {
      username: currentUser? currentUser.username: "",
      file:[],
       bio:currentUser? currentUser.bio:"",
       contact:currentUser? currentUser.contact: ""
     },
   })
  
   // 2. Define a submit handler.
   async function onSubmit(values: z.infer<typeof AddUserToDB>) 
   {
         const updatedPost = await updateAccount({
           ...values,
           $id: currentUser?.$id,
           role: user?.role,
           userId: currentUser?.accountid,
           block: currentUser?.block,
           imageid: currentUser?.imageid,
           userid: currentUser?.accountid,
           imageUrl: currentUser?.imageUrl,
           password: user.password,
           email: user.email,
           newPassword: ""
         });
         console.log(updatedPost)
         if(!updatedPost)
         {
           toast({title:'Please try again'})
         }
         return navigate(`/profile/${user.accountid}`)
  }

  if(isLoading) return (
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
            <p className="p-2 mt-4 text-xl">Edit profile</p>
        </div>
        <div>

    {/*profile update */}
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Username</FormLabel>
              <FormControl>
                <Input placeholder={'username'} className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Profile</FormLabel>
              <FormControl>
                <FileUploader
                fieldChange={field.onChange}
                mediaUrl={currentUser?.imageUrl}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Bio</FormLabel>
              <FormControl>
                <Input placeholder={`about yourself`} className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Contact</FormLabel>
              <FormControl>
                <Input placeholder={'contact'} className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       <center>
          <Button 
          type="submit" className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">
            {isLoadingUpdate?(
              <div className="pl-6">
                <Loader/>
              </div>
            ):(
              <p>Edit Profile</p>
            )}
            </Button>
          <Button type="button" onClick={()=>navigate(`/profile/${user.$id}`)}  
          className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Cancel</Button>
          </center>
      </form>
      </Form>
      </div>
  </div>
  )
}

export default EditProfile