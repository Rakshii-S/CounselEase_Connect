import { useNavigate, useParams } from "react-router-dom"
import { useAddStudentToGroup, useGetBuddyByIdB, useGetCounsellorByIdC, useGetGroupById, useGetRecentPostM, usedeleteStudentFromGroup } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";
import Loader from "../shared/Loader";
import { Button } from "../../../@/components/ui/button";
import { Models } from "appwrite";
import MPostCard from "./MPostCard";


function MGroupView() {
  //hooks and others
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {id} = useParams();

  //tanstack query and appwrite 
  const {data:posts} = useGetRecentPostM();
  const {data: group, isPending} = useGetGroupById(id || '');
  const {data: userB} = useGetBuddyByIdB(group?.buddyId || '');
  const {data: userC} = useGetCounsellorByIdC(group?.counsellorId || '');
  const {mutateAsync: AddStudentToGroup, isPending: addUser} = useAddStudentToGroup();
  const {mutateAsync: deleteStudentFromGroup, isPending: deleteUser} = usedeleteStudentFromGroup();
  
    async function  addStudentToGroup(){
    group?.studentId.push(user.accountid)
    const student:string[] = group?.studentId
      const value = await AddStudentToGroup({
          groupId: id,
          userId:student
      })
        if(!value)
        alert("there was an error in adding values.")
    }  

    async function DeleteStudentFromGroup(){
        if(group?.studentId.includes(user.accountid))
        {
          const index: number = group.studentId.findIndex((studentId: string[]) => studentId.includes(user.accountid));
          const student: string[] =  group?.studentId.slice(0, index).concat(group?.studentId.slice(index + 1));
          
          let i;
          for(i=0;i<group?.studentId.length;i++)
          {
              await deleteStudentFromGroup({
                  groupId: id,
                  userId: student
              });
          }
          navigate(`/mgroups`)
        }
    }
    return (
      <div className="post_details-container">
        {isPending?<Loader/>:(
          <div className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex border border-dark-4 xl:rounded-l-[24px]">
              <div className="m-10">
                {user.role == "admin"?(
                  <>
                  </>
                ):(
                  <>
                        {user.role == "student" && !group?.studentId.includes(user.accountid) && (
                            <>
                            <div className="flex justify-between">
                                <Button 
                                    onClick={addStudentToGroup}
                                    className="m-10 h-20 w-32 p-4 rounded-xl bg-sky-800 hover:bg-slate-800">
                                      {addUser?(
                                        <Loader/>
                                      ):(
                                        <p>Join the group</p>
                                      )}
                                </Button>
                                <Button onClick={()=>navigate(`/mgroups`)}
                                className="m-10 h-20 w-32 p-4 rounded-xl bg-sky-800 hover:bg-slate-800">
                                  Go back
                                </Button>
                            </div>
                            </>
                        )}
                        {user.role == "student" && group?.studentId.includes(user.accountid) &&(
                            <>
                            <div className="flex justify-between">
                                <Button 
                                    onClick={DeleteStudentFromGroup}
                                    className="m-10 h-20 w-32 p-4 rounded-xl bg-sky-800 hover:bg-slate-800">
                                    {deleteUser?(
                                        <Loader/>
                                      ):(
                                        <p>Leave the group</p>
                                      )}
                                </Button>
                                <Button onClick={()=>navigate(`/mgroups`)}
                                className="m-10 h-20 w-32 p-4 rounded-xl bg-sky-800 hover:bg-slate-800">
                                  Go back
                                </Button>
                                </div>
                            </>
                        )}
                        {user.role == "counsellor" && (
                          <>
                                <Button onClick={()=>navigate(`/mgroups`)}
                                className="m-10 h-20 w-32 p-4 rounded-xl bg-sky-800 hover:bg-slate-800">
                                  Go back
                                </Button>
                          </>
                        )}
                        {user.role == "buddy" && (
                          <>
                                <Button onClick={()=>navigate(`/mgroups`)}
                                className="m-10 h-20 w-32 p-4 rounded-xl bg-sky-800 hover:bg-slate-800">
                                  Go back
                                </Button>
                          </>
                        )}
                  </>
                )}
                
                <div className="flex flex-col justify-center">
                    <div className="mb-8 h-10 text-center text-2xl ">
                        {group?.name}
                    </div>
                    <center>
                    <img
                      src={group?.imageUrl || `https://img.freepik.com/premium-photo/minimal-japanese-kawaii-dog-boy-chibi-anime-vector-art-sticker-with-clean-bold-line-cute-simple_655090-47243.jpg`}
                      className="rounded-full w-56 h-56"
                      alt="group profile"
                      />
                    </center>
                    <div className="mt-8 h-10 text-center text-lg">
                      {group?.bio}
                    </div>
                </div>
                <div className="flex flex-row justify-center">
                    <div className="mt-20 flex flex-row">
                      <img
                        src="/assets/counsellor.png"
                        alt="counsellor"
                        width={25}
                      />
                      <p className="ml-4"> {userC?.username}</p>
                    </div>
                    <div className="mt-20 ml-10 flex flex-row">
                      <img
                        src="/assets/buddy.png"
                        alt="buddy"
                        width={25}
                      />
                      <p className="ml-4"> {userB?.username}</p>
                    </div>
                </div>
              </div>
              {group?.studentId.includes(user.accountid) || group?.counsellorId.includes(user.accountid) || group?.buddyId.includes(user.accountid)?
              (
                <div className="flex justify-end">
                <Button className=" bg-sky-800 hover:bg-slate-800 m-10 p-4 pb-10 rounded-xl" onClick={()=>navigate(`/mcreate-post/${group?.$id}`)}>
                  Create Post
                </Button>
            </div>
              ):(
                <></>
              )}
              <div className="flex justify-center">
              <ul className="flex flex-col">
                  {posts?.documents.map((post: Models.Document) => (
                    <MPostCard post={post} key={post.caption}/>
                  ))}
              </ul>
              </div>
          </div>
        )}
      </div>
    )
}

export default MGroupView