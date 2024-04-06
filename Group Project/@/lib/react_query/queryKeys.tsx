export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",

    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",

    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFilePreview",

    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",

    //GROUP KEYS
    GET_RECENT_GROUPS = "getRecentGroups",
    GET_GROUP_BY_ID = "getGroupById",

    //COUNSELLOR KEYS
    GET_COUNSELLOR_BY_ID_U = "getCounsellorByIdU",
    GET_COUNSELLOR_BY_ID_C = "getCounsellorByIdC",
    GET_RECENT_COUNSELLORS_U = "getRecentCounsellorU",
    GET_RECENT_COUNSELLORS_C= "getRecentCounsellorC",

    //BUDDY KEYS 
    GET_BUDDY_BY_ID_U = "getBuddyByIdU",
    GET_BUDDY_BY_ID_B = "getBuddyByIdB",
    GET_RECENT_BUDDY_U = "getRecentBuddyU",
    GET_RECENT_BUDDY_B= "getRecentBuddyB"

}