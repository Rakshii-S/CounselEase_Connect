import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { IGroupCollection, INewBuddy, INewCounsellor, INewGroup, INewPost, INewPostM, INewUser, ISchedule, IUpdateBuddy, IUpdateCounsellor, IUpdateGroup, IUpdatePost, IUpdatePostM, IUpdateUser } from '../../../types';
import { AddSchedule, AddStudentToGroup, UpdateBuddyB, UpdateBuddyU, UpdateCounsellorC, UpdateCounsellorU, UpdateEmail, UpdatePassword, UpdateUser, addBuddy, addCounsellor, createGroup, createPost, createPostM, createUserAccount, getBuddyByIdB, getBuddyByIdU, getCounsellorByIdC, getCounsellorByIdU, getCurrentUser, getCurrentUserCollections, getGroupById, getPostById, getPostByIdM, getRecentBuddyB, getRecentBuddyU, getRecentCounsellorC, getRecentCounsellorU, getRecentGroups, getRecentPosts, getRecentPostsM, getScheduleById, likePost, likePostM, saveStudentToDB, signInAccount, signOutAccount, updateGroup, updatePost, updatePostM, updateSchedule, updateUserAccount} from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

//create new user account 
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user:INewUser) => createUserAccount(user)
    })
}

export const useUpdateUserAccount = () => {
    return useMutation({
        mutationFn: (user:IUpdateUser) => updateUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user:{
            email:string; 
            password:string;
        }) => signInAccount(user)
    })
}

export const useSignOutAccout = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetCurrentUserCollection = (userId: string, role:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, userId],
        queryFn: () => getCurrentUserCollections(userId, role),
        enabled:  !!userId
    })
}

//update email 
export const useUpdateUserEmail = () => {
    return useMutation({
        mutationFn: (user:IUpdateUser) => UpdateEmail(user)
    })
}

//update email 
export const useUpdateUserPassword = () => {
    return useMutation({
        mutationFn: (user:IUpdateUser) => UpdatePassword(user)
    })
}

//STUDENT 
export const useStudentAccount = () => {
    return useMutation({
        mutationFn: (user:{accountid:string, groupid:any}) => saveStudentToDB(user)
    })
}

// POSTS SECTION
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:INewPost) => createPost(post),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useGetRecentPost= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, likeArray}:{postId:string; likeArray:string[]}) =>likePost(postId, likeArray),
        onSuccess:(data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled:  !!postId
    })
}

//GROUP CREATION SECTION
export const useCreateGroup = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (group:INewGroup) => createGroup(group),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_GROUPS]
            })
        }
    })
}

export const useAddStudentToGroup = () => {
    return useMutation({
        mutationFn: (user:IGroupCollection) => AddStudentToGroup(user)
    })
}

export const usedeleteStudentFromGroup = () => {
    return useMutation({
        mutationFn: (user:IGroupCollection) => AddStudentToGroup(user)
    })
}

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (group: IUpdateGroup) => updateGroup(group),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_GROUP_BY_ID, data?.$id]
            })
        }
    })
}

export const useGetRecentGroup= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_GROUPS],
        queryFn: getRecentGroups,
    })
}

export const useGetGroupById = (groupId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_GROUP_BY_ID, groupId],
        queryFn: () => getGroupById(groupId),
        enabled:  !!groupId
    })
}

//COUNSELLOR SECTION
export const useAddCounsellor = () => {
    return useMutation({
        mutationFn: (user:INewCounsellor) => addCounsellor(user)
    })
}

export const useUpdateCounsellorU = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateCounsellor) => UpdateCounsellorU(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS. GET_COUNSELLOR_BY_ID_U, data?.$id]
            })
        }
    })
}

export const useUpdateCounsellorC = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateCounsellor) => UpdateCounsellorC(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS. GET_COUNSELLOR_BY_ID_C, data?.$id]
            })
        }
    })
}

export const useGetRecentCounsellorU= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_COUNSELLORS_U],
        queryFn: getRecentCounsellorU,
    })
}

export const useGetRecentCounsellorC= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_COUNSELLORS_C],
        queryFn: getRecentCounsellorC,
    })
}

export const useGetCounsellorByIdU = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COUNSELLOR_BY_ID_U, userId],
        queryFn: () => getCounsellorByIdU(userId),
        enabled:  !!userId
    })
}

export const useGetCounsellorByIdC = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COUNSELLOR_BY_ID_C, userId],
        queryFn: () => getCounsellorByIdC(userId),
        enabled:  !!userId
    })
}

// BUDDY SECTION
export const useAddBuddy = () => {
    return useMutation({
        mutationFn: (user:INewBuddy) => addBuddy(user)
    })
}

export const useUpdateBuddyU = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateBuddy) => UpdateBuddyU(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS. GET_BUDDY_BY_ID_U, data?.$id]
            })
        }
    })
}

export const useUpdateBuddyB = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateBuddy) => UpdateBuddyB(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS. GET_BUDDY_BY_ID_B, data?.$id]
            })
        }
    })
}

export const useGetBuddyByIdU = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_BUDDY_BY_ID_U, userId],
        queryFn: () => getBuddyByIdU(userId),
        enabled:  !!userId
    })
}

export const useGetBuddyByIdB = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_BUDDY_BY_ID_B, userId],
        queryFn: () => getBuddyByIdB(userId),
        enabled:  !!userId
    })
}

export const useGetRecentBuddyU= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_BUDDY_U],
        queryFn: getRecentBuddyU,
    })
}

export const useGetRecentBuddyB= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_BUDDY_B],
        queryFn: getRecentBuddyB,
    })
}

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => UpdateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS. GET_USER_BY_ID, data?.$id]
            })
        }
    })
}

//group posts
export const useCreatePostM = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:INewPostM) => createPostM(post),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useUpdatePostM = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePostM) => updatePostM(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useGetRecentPostM= () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPostsM,
    })
}

export const useLikePostM = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, likeArray}:{postId:string; likeArray:string[]}) =>likePostM(postId, likeArray),
        onSuccess:(data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


export const useGetPostByIdM = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostByIdM(postId),
        enabled:  !!postId
    })
}

//schedule
export const useAddSchedule = () => {
    return useMutation({
        mutationFn: (user:ISchedule) => AddSchedule(user)
    })
}

export const useGetSchedulebyId = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COUNSELLOR_BY_ID_U, userId],
        queryFn: () => getScheduleById(userId),
        enabled:  !!userId
    })
}

export const useUpdateSchedule = () => {
    return useMutation({
        mutationFn: (user:ISchedule) => updateSchedule(user)
    })
}