import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../../../@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../../../@/components/ui/form"
import { Input } from "../../../@/components/ui/input"
import { useNavigate, useParams } from "react-router-dom"
import FileUploader from "../shared/FileUploader"
import { useToast } from "../../../@/components/ui/use-toast"
import { useUserContext } from "../../../context/AuthContext"
import { Models } from "appwrite"
import { useCreatePostM, useGetGroupById, useUpdatePostM } from "../../../@/lib/react_query/queryNmutation"
import Loader from "../shared/Loader"


//form validation by zod
export const AddPostToDB = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  tags: z.string().min(8).max(3000),
})

//props
type PostForm={
  post?:Models.Document;
  action:'Create' | 'Update'
}

function MPostForm({post,action}:PostForm) 
{
  //hooks and others
  const {toast} = useToast();
  const navigate = useNavigate();
  const {id} = useParams();

  //tanstack query, appwrite and context 
  const {user} = useUserContext();
  const {data: group} = useGetGroupById(id || '');
  const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePostM();
  const {mutateAsync: updatePost, isPending: isLoadingUpdate} = useUpdatePostM();

  // 1. Define your form.
  const form = useForm<z.infer<typeof AddPostToDB>>({
    resolver: zodResolver(AddPostToDB),
    defaultValues: {
      caption:"",
      file:[],
      tags:"",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AddPostToDB>) 
  {
    if(post && action=="Update")
    {
        const updatedPost = await updatePost({
          ...values,
          groupId: group?.$id,
          postId: post.$id,
          imageId:post?.imageId,
          imageUrl:post?.imageUrl
        })
        if(!updatedPost)
        {
          toast({title:'Please try again'})
        }
        if(user.role == "admin")
          {
          return navigate(`/groups`);
          }
        else 
        {
          return navigate(`/mgroups`);
        }
    } 
    else
    {
        const newPost = await createPost({
          ...values,
          groupId: group?.$id,
          userId: user.id,
          email: user.email
        })

        if(!newPost){
          toast({
            title:'Please try again'
          })
        }else{
          toast({
            title:'Post uploaded successfully'
          })
        }
        if(user.role == "admin")
          {
          return navigate(`/groups`);
          }
        else 
        {
          return navigate(`/mgroups`);
        }
    }
  }

  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Caption</FormLabel>
              <FormControl>
                <Input placeholder={post?.caption} className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14" {...field}/>
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
              <FormLabel className="m-4">Add image</FormLabel>
              <FormControl>
                <FileUploader
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Add tags</FormLabel>
              <FormControl>
                <Input placeholder={post?.tags || `peace, love, care`} className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <center>
          <Button type="submit" className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">
            {isLoadingCreate || isLoadingUpdate?(
              <div className="pl-10 pt-2">
                <Loader/>
              </div>
            ):(
              <p>{action} Post</p>
            )}
            </Button>
          {user.role == "admin" ?
          (
            <Button type="button" onClick={()=>navigate(`/groups`)}  className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Cancel</Button>

          ):
          (
            <Button type="button" onClick={()=>navigate(`/mgroups`)}  className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Cancel</Button>

          )}          
        </center>
      </form>
    </Form>
    </div>
  )
}

export default MPostForm