import { useNavigate, useParams } from "react-router-dom"
import { useGetBuddyByIdB, useGetCounsellorByIdC, useGetGroupById, useGetRecentPostM } from "../../../@/lib/react_query/queryNmutation";
import { useUserContext } from "../../../context/AuthContext";
import Loader from "../shared/Loader";
import { Button } from "../../../@/components/ui/button";
import { deleteGroupById } from "../../../@/lib/appwrite/api";
import { Models } from "appwrite";
import MPostCard from "../groups/MPostCard";


function ViewGroup() {
  //hooks and others
  const navigate = useNavigate();
  const {id} = useParams()

  //tanstack query, appwrite and context 
  const {user} = useUserContext();
  const {data: group, isPending} = useGetGroupById(id || '');
  const {data: userB} = useGetBuddyByIdB(group?.buddyId || '');
  const {data: userC} = useGetCounsellorByIdC(group?.counsellorId || '');
  const {data:posts} = useGetRecentPostM();
    
    function deleteGroup()
    {
        deleteGroupById(id)
        alert("Group deleted sucessfully.")
        navigate('/groups')
    }
    return (
      <div className="post_details-container">
        {isPending?<Loader/>:(
          <div className="bg-dark-2 w-full max-w-5xl rounded-[30px] flex-col flex border border-dark-4 xl:rounded-l-[24px]">
              <div className="m-10">
                {user.role == "admin"?(
                  <div className="flex flex-row mb-10 justify-between">
                  <div onClick={deleteGroup}>
                    <img
                    src="/assets/trash.png"
                    alt=""
                    width={30}
                    />
                  </div>
                  <div onClick={()=>navigate(`/edit-group/${id}`)}>
                    <img
                    src="/assets/edit.png"
                    alt=""
                    width={25}
                    />
                  </div>
              </div>
                ):(
                  <>
                        { user && (
                          <>
                            <Button 
                             className="m-10 h-16 w-24 p-4 rounded-xl bg-sky-800 hover:bg-slate-800"
                             >
                              Join
                            </Button>
                          </>
                        )}
                        {user.role === "counsellor" && (
                          <>
                            <div>Admin Dashboard</div>
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

export default ViewGroup