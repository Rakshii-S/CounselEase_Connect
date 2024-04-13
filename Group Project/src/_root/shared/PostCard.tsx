import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";
import PostLikes from "./PostLikes";
import { multiFormatDateString } from "../../../@/lib/utils";
import { useGetCurrentUserCollection } from "../../../@/lib/react_query/queryNmutation";

//user defined type
type PostCardProps = {
    post: Models.Document;
}

function PostCard({post}:PostCardProps) 
{
    //context
    const {user} = useUserContext();
    const {data: currentUser} = useGetCurrentUserCollection(post.creator.$id, post.creator.role);
    if(!post.creator) return Error;
    return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <div >
                    <img src={currentUser?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt="creator"
                    className="rounded-full w-12 h-12"/>
                </div>
                <div className="flex flex-col">
                    <p className="base-medium text-sm lg:body-bold text-light-1">
                        {currentUser?.username}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">
                            {multiFormatDateString(post.$createdAt)}
                        </p>
                    </div>
                </div>
            </div>
            {user.role == "admin" ?(
                <Link  to={`/edit-post/${post.$id}`} className={`${user.$id === post.creator.$id && "hidden"}`}>
                <img 
                src="/assets/edit.png"
                alt="edit"
                width={20}
                height={20}
                />
            </Link>
            ):(
                <></>
            )}
        </div>
        <Link to={`/post/${post.$id}`}>
            <div className="small-medium lg:base-medium py-4">
                <p>{post.caption}</p>
                <ul className="flex gap-1 mt-2">
                    {post.tags.map((tag:string)=> (
                        <li key={tag} className="text-light-3">
                            #{tag}
                        </li>
                    )
                    )}
                </ul>
            </div>
            <img
                src={post.imageUrl || '/assets/icons/profile-placeholder.svg'}
                className="post-card_img"
                alt="post image"
            />
        </Link>
        <PostLikes post={post} userId={user.id}/>
    </div>
  )
}

export default PostCard