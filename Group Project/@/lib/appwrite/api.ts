import { v4 } from "uuid";
import { IGroupCollection, INewBuddy, INewCounsellor, INewGroup, INewPost, INewPostM, INewUser, IUpdateBuddy, IUpdateCounsellor, IUpdateGroup, IUpdatePost, IUpdatePostM, IUpdateUser } from "../../../types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID } from "appwrite";

// user creation and login
export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            user.userid,
            user.email,
            user.password,
            user.username
        );
        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.username);

        //user collection
        const newUser = await saveUserToDB({
            accountid: user.userid,
            role: "student",
            password: user.password,
            email: newAccount.email,
        });
        //student collection
        const userAdmin = await saveUserToStudentDB({
            accountid: user.userid,
            bio: "",
            username: user.username,
            imageUrl: avatarUrl,
            imageid: ""
        })
        return newUser;

    } catch (error) {
        return error;
    }
}
// add user details to user collection
export async function saveUserToDB(user: {
    accountid: string;
    role: string,
    email: string,
    password: string,
}) {
    try {
        console.log(user);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.accountid,
            user
        )
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

// add user details to student collection
export async function saveUserToStudentDB(user: {
    accountid: string,
    bio: string,
    username: string,
    imageUrl: any,
    imageid: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentCollectionId,
            user.accountid,
            user
        )
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

// delete account, create and update the auth account
export async function updateUserAccount(user: IUpdateUser) {
    try {
        const res = await fetch(`http://localhost:3000/deleteUser/${user.userid}`);
        const data = await res.json();
        const newAccount = await account.create(
            user.userid,
            user.email,
            user.password,
            user.username
        );
        if (!newAccount) throw Error;

        await UpdateUser({
            email: newAccount.email,
            file: user.file,
            userid: user.userid,
            block: user.block,
            contact: user.contact,
            imageid: user.imageid,
            imageUrl: user.imageUrl,
            username: user.username,
            bio: user.bio,
            password: user.password,
            $id: user.userId,
            userId: user.userId,
            role: user.role,
            newPassword: ""
        })

    } catch (error) {
        return error;
    }
}

//update email 
export async function UpdateEmail(user: IUpdateUser) {
    //update email 
    const promise = account.updateEmail(user.email, user.password);
    let Uemail = (await promise).email
    if (!promise) throw Error
    await UpdateUser({
        email: Uemail,
        file: user.file,
        userid: user.userId,
        block: user.block,
        contact: user.contact,
        imageid: user.imageid,
        imageUrl: user.imageUrl,
        username: user.username,
        bio: user.bio,
        password: user.password,
        $id: user.userId,
        userId: user.userId,
        role: user.role,
        newPassword: undefined
    })
}

//update password
export async function UpdatePassword(user: IUpdateUser) {
    //update password
    const promise = account.updatePassword(user.newPassword, user.password);
    if (!promise) throw Error
    await UpdateUser({
        email: user.email,
        file: user.file,
        userid: user.userId,
        block: user.block,
        contact: user.contact,
        imageid: user.imageid,
        imageUrl: user.imageUrl,
        username: user.username,
        bio: user.bio,
        password: user.newPassword,
        $id: user.userId,
        userId: user.userId,
        role: user.role,
        newPassword: ""
    })
}

//delete all the users
export async function DeleteUser(userid: string, userrole: string) {
    const res = await fetch(`http://localhost:3000/deleteUser/${userid}`);
    const data = await res.json();
    const updatedCousellor = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userid)
    if (userrole == "student") {
        const currentUser1 = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentCollectionId,
            userid
        );
        if (currentUser1) {
            return alert("Acoount deleted successfully.");
        }
    }
    if (userrole == "admin") {
        const currentUser2 = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.adminCollectionId,
            userid
        );
        if (currentUser2) {
            return alert("Acoount deleted successfully.");
        }
    }

    if (userrole == "counsellor") {
        const currentUser3 = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.counsellorCollectionId,
            userid
        );
        if (currentUser3) {
            return alert("Acoount deleted successfully.");
        }
    }

    if (userrole == "buddy") {
        const currentUser4 = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.buddyCollectionId,
            userid
        );
        if (currentUser4) {
            return alert("Acoount deleted successfully.");
        }
    }
}

//update all the users 
export async function UpdateUser(user: IUpdateUser) {
    try {
        //upload image to storage
        let uploadedFile;
        let imgID;
        let fileUrl;
        if (user.file[0] == undefined) {
            user.file = undefined
        }
        if (true) {
            if (user.file != undefined) {
                uploadedFile = await uploadProfile(user.file[0]);
                if (!uploadedFile) throw Error;

                //Get file url
                fileUrl = storage.getFileView(
                    appwriteConfig.profileStorageId,
                    uploadedFile.$id);
                if (!fileUrl) {
                    deleteProfile(uploadedFile.$id);
                    throw Error;
                }
            }
        } else {
            if (user.file != undefined) {
                await deleteProfile(user.imageid);
                uploadedFile = await uploadProfile(user.file[0]);
                if (!uploadedFile) throw Error;
                imgID = uploadedFile.$id
                //Get file url
                fileUrl = storage.getFileView(
                    appwriteConfig.profileStorageId,
                    uploadedFile.$id);
                if (!fileUrl) {
                    deleteProfile(uploadedFile.$id);
                    throw Error;
                }
            }
        }
        //makes changes in the auth
        //update name 
        const promise = account.updateName(user.username)
        console.log(promise)
        if (!promise) throw Error

        if ((user.file != undefined && user.imageUrl == "") || (user.imageid == "" && user.imageUrl == "")) {
            fileUrl = avatars.getInitials(user.username);
        }
        const updatedCousellor = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                role: user.role,
                accountid: user.userId,
                email: user.email,
                password: user.password,
            })
        console.log(updatedCousellor)
        if (user.role == "student") {
            console.log(user.role)
            const currentUser1 = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.studentCollectionId,
                user.userId,
                {
                    accountid: user.userId,
                    bio: user.bio,
                    username: user.username,
                    imageUrl: fileUrl,
                    imageid: imgID
                }
            );
            if (currentUser1) {
                console.log(currentUser1);
                return currentUser1;
            }
        }
        if (user.role == "admin") {
            const currentUser2 = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.adminCollectionId,
                user.userId,
                {
                    accountid: user.userId,
                    bio: user.bio,
                    username: user.username,
                    imageUrl: fileUrl,
                    imageid: imgID
                }
            );
            if (currentUser2) {
                console.log(currentUser2);
                return currentUser2;
            }
        }

        if (user.role == "counsellor") {
            const currentUser3 = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.counsellorCollectionId,
                user.userId,
                {
                    accountid: user.userId,
                    bio: user.bio,
                    username: user.username,
                    imageUrl: fileUrl,
                    imageid: imgID,
                    contact: user.contact,
                    block: user.block
                }
            );
            if (currentUser3) {
                console.log(currentUser3);
                return currentUser3;
            }
        }

        if (user.role == "buddy") {
            const currentUser4 = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.buddyCollectionId,
                user.userId,
                {
                    accountid: user.userId,
                    bio: user.bio,
                    username: user.username,
                    imageUrl: fileUrl,
                    imageid: imgID,
                    contact: user.contact
                }
            );
            if (currentUser4) {
                console.log(currentUser4);
                return currentUser4;
            }
        }
        if (!updatedCousellor) {
            await deleteProfile(user.imageid);
            throw Error;
        }
        return updatedCousellor
    } catch (error) {
        console.log(error);
    }
}

export async function uploadProfile(file: File) {
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.profileStorageId,
            ID.unique(),
            file
        );
        return uploadFile;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteProfile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.profileStorageId, fileId);
        return "ok"
    } catch (error) {
        console.log(error)
    }
}

//create email session
export async function signInAccount(user: {
    email: string;
    password: string
}) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log(error)
    }
}

//delete email session
export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error)
    }
}

// to get current user from user collection
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        const currentUser = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentAccount.$id
        );
        if (!currentUser) throw Error;
        return currentUser;
    } catch (error) {
        console.log(error);
    }
}

//to get current user from all collections
export async function getCurrentUserCollections(userId: string, role: string) {
    try {
        if (role == "student") {
            const currentUser1 = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.studentCollectionId,
                userId
            );
            if (currentUser1) {
                return currentUser1;
            }
        }
        if (role == "admin") {
            const currentUser2 = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.adminCollectionId,
                userId
            );
            if (currentUser2) {
                return currentUser2;
            }
        }

        if (role == "counsellor") {
            const currentUser3 = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.counsellorCollectionId,
                userId
            );
            if (currentUser3) {
                return currentUser3;
            }
        }

        if (role == "buddy") {
            const currentUser4 = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.buddyCollectionId,
                userId
            );
            if (currentUser4) {
                return currentUser4;
            }
        }
        return null;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//buddy (create and add buddy to user and buddy collection)
export async function addBuddy(user: INewBuddy) {
    try {
        console.log("Entered the add buddy!!")
        console.log(user)
        const newAccount = await account.create(
            user.userId,
            user.email,
            user.password,
            user.username
        );
        console.log(newAccount)
        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.username);

        const Cuser = await saveBuddyToDB({
            accountid: user.userId,
            bio: "",
            username: user.username,
            imageUrl: avatarUrl,
            imageid: "",
            contact: user.contact
        })
        console.log(Cuser)
        const newUser = await saveUserToDB({
            accountid: user.userId,
            password: user.password,
            role: "buddy",
            email: user.email
        });
        console.log(newUser)
        return newUser;

    } catch (error) {
        return error;
    }
}

//add user details to buddy collection
export async function saveBuddyToDB(user: {
    accountid: string,
    bio: string,
    username: string,
    imageUrl: any,
    imageid: string,
    contact: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.buddyCollectionId,
            user.accountid,
            user
        )
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

//update buddy details in user collection
export async function UpdateBuddyU(user: IUpdateBuddy) {
    try {
        const updatedBuddy = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                accountid: user.$id,
                role: "buddy",
                email: user.email,
                password: user.password
            })
        if (!updatedBuddy) {
            await deleteFile(user.imageId);
            throw Error;
        }
        return updatedBuddy
    } catch (error) {
        console.log(error);
    }
}

//update buddy details in buddy collection
export async function UpdateBuddyB(user: IUpdateBuddy) {
    try {
        const avatarUrl = avatars.getInitials(user.username);
        const updatedBuddy = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.buddyCollectionId,
            user.$id,
            {
                contact: user.contact,
                username: user.username,
                bio: user.bio,
                imageUrl: avatarUrl,
                imageid: user.imageId,
                accountid: user.$id
            })
        if (!updatedBuddy) {
            await deleteFile(user.imageId);
            throw Error;
        }
        return updatedBuddy
    } catch (error) {
        console.log(error);
    }
}

//buddy from user collection by id
export async function getBuddyByIdU(userId: string) {
    try {
        console.log(userId)
        const buddy = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )
        return buddy
    } catch (error) {
        console.log(error)
    }
}
//buddy from buddy collection by id
export async function getBuddyByIdB(userId: string) {
    try {
        console.log(userId)
        const buddy = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.buddyCollectionId,
            userId
        )
        return buddy
    } catch (error) {
        console.log(error)
    }
}

//buddies from user collection 
export async function getRecentBuddyU() {
    const buddy = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
    )

    if (!buddy) throw Error
    return buddy
}

//buddies from buddy collection 
export async function getRecentBuddyB() {
    const buddy = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.buddyCollectionId,
    )

    if (!buddy) throw Error
    return buddy
}

//official posts 
export async function createPost(post: INewPost) {
    try {
        //upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        //Get file url
        const fileUrl = storage.getFileView(
            appwriteConfig.officialPostsStorageId,
            uploadedFile.$id);
        if (!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        }
        console.log(fileUrl);
        // convert tags into an array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        //save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.officialPostsCollectionId,
            v4(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                email: post.email,
                tags: tags
            }
        )
        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
        return newPost
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.officialPostsStorageId,
            ID.unique(),
            file
        );
        return uploadFile;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.officialPostsStorageId, fileId);
        return "ok"
    } catch (error) {
        console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
    try {
        const hasFileToUpdate = post.file.length > 0;
        try {
            let image = {
                imageUrl: post.imageUrl,
                imageId: post.imageId
            }
            if (hasFileToUpdate) {
                //upload image to storage
                deleteFile(post.imageId);
                const uploadedFile = await uploadFile(post.file[0]);
                if (!uploadedFile) throw Error;

                //Get file url
                const fileUrl = storage.getFileView(
                    appwriteConfig.officialPostsStorageId,
                    uploadedFile.$id);
                if (!fileUrl) {
                    deleteFile(uploadedFile.$id);
                    throw Error;
                }
                image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
            }
            // convert tags into an array
            const tags = post.tags?.replace(/ /g, '').split(',') || [];

            //save post to database
            const updatedPost = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.officialPostsCollectionId,
                post.postId,
                {
                    caption: post.caption,
                    imageUrl: image.imageUrl,
                    imageId: image.imageId,
                    tags: tags
                })
            if (!updatedPost) {
                await deleteFile(post.imageId);
                throw Error;
            }
            return updatedPost
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function deletePostById(postId: any) {
    try {
        console.log(postId)
        const postInfo = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.officialPostsCollectionId,
            postId
        )
        console.log(postInfo.imageId)
        const Gfile = storage.deleteFile(appwriteConfig.officialPostsStorageId, postInfo.imageId);
        if (!Gfile) throw Error

        const post = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.officialPostsCollectionId,
            postId);

        if (!post) throw Error

    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.officialPostsCollectionId,
    )

    if (!posts) throw Error
    return posts
}

export async function likePost(postId: string, likeArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.officialPostsCollectionId,
            postId,
            {
                likes2: likeArray
            }
        )
        if (!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId: string) {
    try {
        console.log(postId)
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.officialPostsCollectionId,
            postId
        )
        return post
    } catch (error) {
        console.log(error)
    }
}

//GROUP SECTION
export async function createGroup(group: INewGroup) {
    try {
        //upload image to storage
        const uploadedFile = await uploadFileGroupProfile(group.file[0]);
        if (!uploadedFile) throw Error;

        //Get file url
        const fileUrl = storage.getFileView(
            appwriteConfig.profileStorageId,
            uploadedFile.$id);
        if (!fileUrl) {
            deleteFileGroup(uploadedFile.$id);
            throw Error;
        }
        console.log(fileUrl);
        console.log("reached the create group method")
        //save post to database
        const newGroup = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            v4(),
            {
                name: group.name,
                bio: group.bio,
                counsellorId: group.counsellorId,
                buddyId: group.buddyId,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id
            }
        )
        if (!newGroup) {
            await deleteFileGroup(uploadedFile.$id);
            throw Error;
        }
        return newGroup
    } catch (error) {
        console.log(error);
    }
}

export async function updateGroup(group: IUpdateGroup) {
    try {
        const hasFileToUpdate = group.file.length > 0;
        try {
            let image = {
                imageUrl: group.imageUrl,
                imageId: group.imageId
            }
            console.log(group.imageUrl)
            if (hasFileToUpdate) {
                //upload image to storage
                deleteFileGroup(group.imageId);
                const uploadedFile = await uploadFileGroupProfile(group.file[0]);
                if (!uploadedFile) throw Error;

                //Get file url
                const fileUrl = storage.getFileView(
                    appwriteConfig.profileStorageId,
                    uploadedFile.$id);
                if (!fileUrl) {
                    deleteFileGroup(uploadedFile.$id);
                    throw Error;
                }
                image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
            }

            //save group to database
            const updatedGroup = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.groupCollectionId,
                group.groupId,
                {
                    name: group.name,
                    bio: group.bio,
                    counsellorId: group.counsellorId,
                    buddyId: group.buddyId,
                    imageUrl: image.imageUrl,
                    imageId: image.imageId
                })
            if (!updatedGroup) {
                await deleteFileGroup(group.imageId);
                throw Error;
            }
            return updatedGroup
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFileGroupProfile(file: File) {
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.profileStorageId,
            v4(),
            file
        );
        return uploadFile;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFileGroup(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.profileStorageId, fileId);
        return "ok"
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentGroups() {
    const groups = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.groupCollectionId,
    )
    if (!groups) throw Error
    return groups
}

export async function getGroupById(groupId: string) {
    try {
        console.log(groupId)
        const group = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            groupId
        )
        return group
    } catch (error) {
        console.log(error)
    }
}

export async function deleteGroupById(groupId: any) {
    try {
        console.log(groupId)
        const groupInfo = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            groupId
        )
        console.log(groupInfo.imageId)
        const Gfile = storage.deleteFile(appwriteConfig.profileStorageId, groupInfo.imageId);
        if (!Gfile) throw Error

        const group = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            groupId);

        if (!group) throw Error

    } catch (error) {
        console.log(error);
    }
}

//delete student to the particular group that they join (error)
export async function deleteStudentFromGroup(user: IGroupCollection) {
    try {
        const Nuser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            user.groupId,
            {
                studentId: user.userId
            })
        console.log(Nuser)
        if (!Nuser) {
            throw Error;
        }
        return Nuser
    } catch (error) {
        return error
    }
}

//add student to the particular group that they join (error)
export async function AddStudentToGroup(user: IGroupCollection) {
    console.log(user.userId)
    console.log(user.groupId)
    try {
        const Nuser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            user.groupId,
            {
                studentId: user.userId
            })
        console.log(Nuser)
        if (!Nuser) {
            throw Error;
        }
        return Nuser
    } catch (error) {
        return error
    }
}

//add group id to the student collection
export async function saveStudentToDB(user: {
    accountid: string,
    groupid: any
}) {
    try {
        const newUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentCollectionId,
            user.accountid,
            user
        )
        console.log(newUser + "user added!!!!")
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

//counsellor (create and add buddy to user and buddy collection)
export async function addCounsellor(user: INewCounsellor) {
    try {
        console.log(user)
        console.log("add")
        console.log("Entered the add counsellor!!")
        console.log(user)
        const newAccount = await account.create(
            user.userId,
            user.email,
            user.password,
            user.username
        );

        console.log(newAccount)
        console.log(user)
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.username);
        const Cuser = await saveCounsellorToDB({
            accountid: user.userId,
            block: user.block,
            bio: user.bio,
            username: user.username,
            imageUrl: avatarUrl,
            imageid: "",
            contact: user.contact
        })
        console.log(Cuser)
        const newUser = await saveUserToDB({
            accountid: user.userId,
            password: user.password,
            role: "counsellor",
            email: user.email
        });

        console.log(newUser)
        return newUser;

    } catch (error) {
        return error;
    }
}

//add user details to counsellor collection
export async function saveCounsellorToDB(user: {
    accountid: string,
    bio: string,
    block: string,
    username: string,
    imageUrl: any,
    imageid: string,
    contact: string
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.counsellorCollectionId,
            user.accountid,
            user
        )
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

//update counsellor details in user collection
export async function UpdateCounsellorU(user: IUpdateCounsellor) {
    try {
        const updatedCousellor = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                accountid: user.$id,
                password: user.password,
                role: "counsellor",
                email: user.email
            })
        if (!updatedCousellor) {
            await deleteFile(user.imageId);
            throw Error;
        }
        return updatedCousellor
    } catch (error) {
        console.log(error);
    }
}

//update counsellor details in counsellor collection
export async function UpdateCounsellorC(user: IUpdateCounsellor) {
    try {
        const avatarUrl = avatars.getInitials(user.name);
        const updatedCousellor = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.counsellorCollectionId,
            user.$id,
            {
                accountid: user.$id,
                bio: user.bio,
                username: user.username,
                imageUrl: avatarUrl,
                iamgeid: user.imageId,
                contact: user.contact
            })
        if (!updatedCousellor) {
            await deleteFile(user.imageId);
            throw Error;
        }
        return updatedCousellor
    } catch (error) {
        console.log(error);
    }
}

//counsellor from user collection by id
export async function getCounsellorByIdU(userId: string) {
    try {
        console.log(userId)
        const counsellor = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )
        return counsellor
    } catch (error) {
        console.log(error)
    }
}

//counsellor from counsellor collection by id
export async function getCounsellorByIdC(userId: string) {
    try {
        console.log(userId)
        const counsellor = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.counsellorCollectionId,
            userId
        )
        return counsellor
    } catch (error) {
        console.log(error)
    }
}

//counsellors from user collection 
export async function getRecentCounsellorU() {
    const counsellor = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
    )

    if (!counsellor) throw Error
    return counsellor
}

//counsellors from counsellor collection 
export async function getRecentCounsellorC() {
    const counsellor = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.counsellorCollectionId,
    )

    if (!counsellor) throw Error
    return counsellor
}

//group posts
export async function createPostM(post: INewPostM) {
    try {
        //upload image to storage
        const uploadedFile = await uploadFileM(post.file[0]);
        if (!uploadedFile) throw Error;

        //Get file url
        const fileUrl = storage.getFileView(
            appwriteConfig.postsStorageId,
            uploadedFile.$id);
        if (!fileUrl) {
            deleteFileM(uploadedFile.$id);
            throw Error;
        }
        console.log(fileUrl);
        // convert tags into an array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        //save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupPostsCollectionId,
            v4(),
            {
                creator: post.userId,
                caption: post.caption,
                groupid: post.groupId,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                email: post.email,
                tags: tags
            }
        )
        console.log("Added")
        if (!newPost) {
            await deleteFileM(uploadedFile.$id);
            throw Error;
        }
        return newPost
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFileM(file: File) {
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.postsStorageId,
            ID.unique(),
            file
        );
        return uploadFile;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFileM(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.postsStorageId, fileId);
        return "ok"
    } catch (error) {
        console.log(error)
    }
}

export async function updatePostM(post: IUpdatePostM) {
    try {
        const hasFileToUpdate = post.file.length > 0;
        try {
            let image = {
                imageUrl: post.imageUrl,
                imageId: post.imageId
            }
            if (hasFileToUpdate) {
                //upload image to storage
                deleteFileM(post.imageId);
                const uploadedFile = await uploadFileM(post.file[0]);
                if (!uploadedFile) throw Error;

                //Get file url
                const fileUrl = storage.getFileView(
                    appwriteConfig.postsStorageId,
                    uploadedFile.$id);
                if (!fileUrl) {
                    deleteFileM(uploadedFile.$id);
                    throw Error;
                }
                image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
            }
            // convert tags into an array
            const tags = post.tags?.replace(/ /g, '').split(',') || [];

            //save post to database
            const updatedPost = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.groupPostsCollectionId,
                post.postId,
                {
                    caption: post.caption,
                    groupid: post.groupId,
                    imageUrl: image.imageUrl,
                    imageId: image.imageId,
                    tags: tags
                })
            if (!updatedPost) {
                await deleteFileM(post.imageId);
                throw Error;
            }
            return updatedPost
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPostsM() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.groupPostsCollectionId,
    )

    if (!posts) throw Error
    return posts
}

export async function likePostM(postId: string, likeArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupPostsCollectionId,
            postId,
            {
                likes1: likeArray
            }
        )
        if (!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
        console.log(error)
    }
}

export async function getPostByIdM(postId: string) {
    try {
        console.log(postId)
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupPostsCollectionId,
            postId
        )
        return post
    } catch (error) {
        console.log(error)
    }
}