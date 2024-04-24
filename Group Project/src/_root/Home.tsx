import { Models } from "appwrite";
import {useGetRecentPost} from "../../@/lib/react_query/queryNmutation";
import PostCard from "./shared/PostCard";
import Loader from "./shared/Loader";

function Home() {
  //tanstack query and appwrite 
  const {data:posts, isPending : isPostLoading} = useGetRecentPost();
  
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
            <h2 className="h3-bold md:h3-bold text-left w-full">Home Feed</h2>
            {isPostLoading && !posts?(
              <Loader/>
            ):(<ul className="flex flex-1 flex-col gap-9 w-full">
            {posts?.documents
              .sort((a: Models.Document, b: Models.Document) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()) // Sort the posts based on createdAt in descending order
              .map((post: Models.Document) => (
                <PostCard post={post} key={post.caption}/>
              ))}
          </ul>
              )}
        </div>
      </div>
    </div>
  )
}
export default Home;