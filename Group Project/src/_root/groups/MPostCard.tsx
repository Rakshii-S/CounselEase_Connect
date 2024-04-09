import { Models } from "appwrite";
import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";
import { multiFormatDateString } from "../../../@/lib/utils";
import { useGetCurrentUserCollection, useGetGroupById } from "../../../@/lib/react_query/queryNmutation";
import MPostLikes from "./MPostLikes";

//user defined type
type PostCardProps = {
    post: Models.Document;
}

function MPostCard({post}:PostCardProps) 
{
    //hooks and others
    const {user} = useUserContext();
    const {id} = useParams();

    //tanstack query and appwrite 
    const {data: group} = useGetGroupById(id || '');
    const {data: currentUser} = useGetCurrentUserCollection(post.creator.$id, post.creator.role);
    if(!post.creator) return Error;
    return (
        <>
    {post.groupid == group?.$id ? (
        <div className="post-card mb-14">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                    <img src={currentUser?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                    alt="creator"
                    className="rounded-full w-12 h-12"/>
                </Link>
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {currentUser?.username}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">
                            {multiFormatDateString(post.$createdAt)}
                        </p>
                    </div>
                </div>
            </div>
            {user.role == "admin" || user.accountid == post.creator.$id?(
                <div>
                    <Link  to={`/Medit-post/${post.$id}`} className={`${user.$id === post.creator.$id && "hidden"}`}>
                        <img 
                        src="/assets/edit.png"
                        alt="edit"
                        width={20}
                        height={20}
                        />
                    </Link>
                </div>
            ):(
                <></>
            )}
        </div>
        <Link to={`/Mpost/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
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
        <MPostLikes post={post} userId={user.id}/> 
    </div>
    ):(
        <></>
    )}
    </>
  )
}

export default MPostCard