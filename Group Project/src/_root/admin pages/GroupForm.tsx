import { zodResolver } from "@hookform/resolvers/zod";
import { Models } from "appwrite";
import { z } from "zod";
import { useUserContext } from "../../../context/AuthContext";
import { useToast } from "../../../@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../@/components/ui/form";
import { Input } from "../../../@/components/ui/input";
import FileUploader from "../shared/FileUploader";
import { Button } from "../../../@/components/ui/button";
import Loader from "../shared/Loader";
import { useCreateGroup, useGetRecentBuddyB, useGetRecentBuddyU, useGetRecentCounsellorC, useGetRecentCounsellorU, useUpdateGroup } from "../../../@/lib/react_query/queryNmutation";
import { useForm } from "react-hook-form";
import { Select, SelectContent,  SelectItem,SelectTrigger, SelectValue } from "../../../@/components/ui/select"

//form validation by zod
export const AddGroupToDB = z.object({
    name: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    bio: z.string().min(5).max(3000),
    counsellorId:z.string().min(5).max(3000),
    buddyId : z.string().min(5).max(2240)
  })

//props
type GroupForm =
  {
    group?:Models.Document;
    action:'Create' | 'Update'
  }
  
  function GroupForm({group,action}:GroupForm) 
  {
    //hooks and others
  const {toast} = useToast();
  const navigate = useNavigate();

  //tanstack query, appwrite and context 
  const {user} = useUserContext();
  const {mutateAsync: createGroup, isPending: isLoadingCreate} = useCreateGroup();
  const {mutateAsync: updateGroup, isPending: isLoadingUpdate} = useUpdateGroup();
  
  const {data:usersU1} = useGetRecentBuddyU();
  const {data:usersB} = useGetRecentBuddyB();
  const {data:usersU2} = useGetRecentCounsellorU();
  const {data:usersC} = useGetRecentCounsellorC();

  // 1. Define your form.
  const form = useForm<z.infer<typeof AddGroupToDB>>({
    resolver: zodResolver(AddGroupToDB),
    defaultValues: {
      name: group? group.name:"",
      file:[],
      bio: group? group.bio: "",
      counsellorId:group? group.counsellorId: "",
      buddyId:group? group.buddyId: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AddGroupToDB>) 
  {
    if(group && action=="Update")
    {
        const updatedPost = await updateGroup({
          ...values,
          groupId: group.$id,
          imageId: group?.imageId,
          imageUrl: values.file[0]
        })
        if(!updatedPost)
        {
          toast({title:'Please try again'})
        }
        return navigate(`/groups`)
    } 
    else
    {
        const newPost = await createGroup({
          ...values,
          userId: user.id
        })

        if(!newPost){
          toast({
            title:'Please try again'
          })
        }else{
          toast({
            title:'Group created successfully'
          })
        }
        return navigate('/groups');
    }
 }
    return (
    <div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Group name</FormLabel>
              <FormControl>
                <Input type="text" className="bg-slate-900 m-2 p-4 mb-4 rounded-xl h-14" {...field}/>
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
              <FormLabel className="m-4">Add profile</FormLabel>
              <FormControl>
                <FileUploader
                fieldChange={field.onChange}
                mediaUrl={group?.imageUrl}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     {(
      <>
          <FormField
          control={form.control}
          name="buddyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buddy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14">
                    <SelectValue placeholder="buddy email" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-[300px] w-[450px]">
                {(usersU1?.documents || []).filter(usersU1 => usersU1.role === "buddy").map((userU: Models.Document, index: number) => (
                    <div key={userU.id}>
                      {usersB?.documents && index < usersB.documents.length && (
                        <SelectItem value={userU.accountid} className="bg-slate-900 p-4 h-14">
                          <div className="flex flex-row">
                            <img 
                            src = {usersB.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                            width={30}
                            height={30}
                            className="rounded-full ml-4 mr-8"
                            />
                            <p>{userU.email}</p>
                          </div>
                        </SelectItem>
                      )}
                    </div>
                ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="counsellorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Counsellor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-slate-900 m-2 p-4 mb-4 rounded-xl h-14">
                    <SelectValue placeholder="counsellor email" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-[300px] w-[450px]">
                {(usersU2?.documents || []).filter(usersU2 => usersU2.role === "counsellor").map((userU2: Models.Document, index: number) => (
                    <div key={userU2.id}>
                      {usersC?.documents && index < usersC.documents.length && (
                        <SelectItem value={userU2.accountid} className="bg-slate-900 p-4 h-14">
                          <div className="flex flex-row">
                            <img 
                            src = {usersC.documents[index].imageUrl || `https://i.pinimg.com/474x/60/b1/e4/60b1e4f0d521cfd16e4de3e59a263470.jpg`}
                            width={30}
                            height={30}
                            className="rounded-full ml-4 mr-8"
                            />
                            <p>{userU2.email}</p>
                          </div>
                        </SelectItem>
                      )}
                    </div>
                ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </>
     )}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="m-4">Description</FormLabel>
              <FormControl>
                <Input type="text" className="bg-slate-900 m-2 p-4 mb-10 rounded-xl h-14" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       <center>
          <Button type="submit" className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">
            {isLoadingCreate || isLoadingUpdate?(
              <div className="pl-20">
                <Loader/>
              </div>
            ):(
              <p>{action} Group</p>
            )}
            </Button>
          <Button type="button" onClick={()=>navigate('/groups')}  className="bg-sky-800 m-2 p-4 mb-10 rounded-xl w-56 h-18">Cancel</Button>
          </center>
      </form>
      </Form>
      </div>
    )
  }
  
  export default GroupForm