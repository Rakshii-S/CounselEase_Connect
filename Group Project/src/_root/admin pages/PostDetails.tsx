import { Link, useNavigate, useParams } from 'react-router-dom';
import PostLikes from '../shared/PostLikes';
import { useGetCurrentUserCollection, useGetPostById } from '../../../@/lib/react_query/queryNmutation';
import { useUserContext } from '../../../context/AuthContext';
import { Loader } from 'lucide-react';
import { multiFormatDateString } from '../../../@/lib/utils';
import { Button } from '../../../@/components/ui/button';
import { deletePostById } from '../../../@/lib/appwrite/api';


function PostDetails() {
  //hooks and others
    const {id} = useParams()
    const {data: post, isPending} = useGetPostById(id || '');
    const navigate = useNavigate();
    
   //tanstack query, appwrite and context 
    const {data: currentUser} = useGetCurrentUserCollection(post?.creator.$id, post?.creator.role);
    const {user} = useUserContext();

    function deletePost()
    {
      deletePostById(id)
      navigate('/')
    }

    return (
      <div className="post_details-container">
        {isPending?<Loader/>:(
          <div className="post_details-card">
            <img
            src={post?.imageUrl}
            alt="post"
            className="post_details-img"
            />
            <div className="post_details-info">
              <div className="flex-between w-full">
              <Link to={`/profile/${currentUser?.accountid}`} className="flex items-center gap-3">
                      <img src={currentUser?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                      alt="creator"
                      className="rounded-full w-8 h-8 lg:w-12 lg:h-12"/>
                  <div className="flex flex-col">
                      <p className="base-medium lg:body-bold text-light-1">
                          {currentUser?.username}
                      </p>
                      <div className="flex-center gap-2 text-light-3">
                      <p className="subtle-semibold lg:small-regular">
                          {multiFormatDateString(post?.$createdAt)}
                      </p>
                  </div>
                  </div>
                  </Link>
  
                  <div className="flex-center ">
                    <Link to={`/edit-post/${post?.$id}`} className={`${user.id !== post?.creator.$id && "hidden"}`}>
                      <img
                      src="/assets/edit.png"
                      width={24}
                      height={24}
                      alt="edit"
                      />
                    </Link>
                    <Button
                    variant="ghost"
                    className={`ghost_details-delete_btn ml-4 ${user.id !== post?.creator.$id && "hidden"}`}
                    onClick={deletePost}
                    >
                      <img
                      src="/assets/trash.png"
                      alt="delete"
                      width={24}
                      height={24}
                      />
                    </Button>
                  </div>
              </div>
              <hr className="border w-full border-dark-4/80"/>
              <div className="flex flex-col flex-1 w-full small-medium">
                  <p>{post?.caption}</p>
                  <ul className="flex gap-1 mt-2">
                      {post?.tags.map((tag:string)=> (
                          <li key={tag} className="text-light-3">
                              #{tag}
                          </li>
                      )
                      )}
                  </ul>
              </div>
              <div className="w-full">
                      <PostLikes post={post} userId={user.id}/>
              </div>
              </div>
          </div>
        )}
      </div>
    )
}

export default PostDetails