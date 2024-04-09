import { Models } from "appwrite";
import React, { useState } from "react";
import { useLikePost } from "../../../@/lib/react_query/queryNmutation";
import { checkIsLiked } from "../../../@/lib/utils";

type PostStatsProps={
    post?: Models.Document;
    userId:string
}

function PostLikes({post, userId}:PostStatsProps) 
{
    const likeList = post?.likes2.map((user:Models.Document) => user.$id)
    console.log(likeList)
    const [likes, setLikes] = useState(likeList);
    const {mutate: likePost} = useLikePost();

    const handleLikePost = (e:React.MouseEvent) => 
    {
        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);
        if(hasLiked)
        {
            newLikes = newLikes.filter((id) => id !== userId);
        }else{
            newLikes.push(userId);
        }
        setLikes(newLikes)
        likePost({postId: post?.$id || '', likeArray: newLikes})
    }
    
  return (
    <div className="flex justify-between items-center">
        <div className="flex gap-2 mr-5">
            <img 
            src={`${checkIsLiked(likes,userId)
                ? "/assets/liked.png":
                "/assets/like.png"}
                `}
            alt="like"
            width={20}
            height={20}
            onClick={handleLikePost}
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
    </div>
  )
}

export default PostLikes