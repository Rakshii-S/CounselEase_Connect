import { v4 } from "uuid";
import { IActivity, IAppointment, IGroupCollection, INewBuddy, INewCounsellor, INewGroup, INewPost, INewPostM, INewUser, ISchedule, ISummary, IUpdateBuddy, IUpdateCounsellor, IUpdateGroup, IUpdatePost, IUpdatePostM, IUpdateUser } from "../../../types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

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

        //user collection
        const newUser = await saveUserToDB({
            accountid: user.userid,
            role: "student",
            password: user.password,
            email: newAccount.email,
        });
        //student collection
        const avatarUrl: any = avatars.getInitials(user.username);
        let uploadedFile: any
        let fileUrl
        try {
            // Convert URL to File
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const filename = "image";
            const avatarFile = new File([blob], filename);

            // Upload the file
            uploadedFile = await uploadProfile(avatarFile);
            if (!uploadedFile) throw Error();

            // Get file URL
            fileUrl = storage.getFileView(appwriteConfig.profileStorageId, uploadedFile.$id);
            if (!fileUrl) {
                deleteProfile(uploadedFile.$id);
                throw Error();
            }

        } catch (error) {
            console.error('Error:', error);
        }

        await saveUserToStudentDB({
            accountid: user.userid,
            bio: "",
            username: user.username,
            imageUrl: fileUrl,
            imageid: uploadedFile.$id
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
        const res = await fetch(`https://counselease-connect-1.onrender.com/deleteUser/${user.userid}`);
        await res.json();
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
    alert("Email updated successfully.")
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
    alert("Password updated successfully.")
}

//delete all the users
export async function DeleteUser(userid: string, userrole: string, imageid: string) {
    if (confirm("Do you want to delete the account? ")) {
        const res = await fetch(`https://counselease-connect-1.onrender.com/deleteUser/${userid}`);
        await res.json();
        //delete image from the storage
        deleteProfile(imageid);
        await databases.deleteDocument(
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
                alert("Account deleted successfully.");
            }
        }
        if (userrole == "admin") {
            const currentUser2 = await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.adminCollectionId,
                userid
            );
            if (currentUser2) {
                alert("Account deleted successfully.");
            }
        }

        if (userrole == "counsellor") {
            const currentUser3 = await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.counsellorCollectionId,
                userid
            );
            if (currentUser3) {
                alert("Account deleted successfully.");
            }
        }

        if (userrole == "buddy") {
            const currentUser4 = await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.buddyCollectionId,
                userid
            );
            if (currentUser4) {
                alert("Account deleted successfully.");
            }
        }

        window.location.reload()
    } else {
        return alert("Delete operation has been cancelled.");
    }
}

//update all the users 
export async function UpdateUser(user: IUpdateUser) {
    try {
        //upload image to storage
        let uploadedFile: any;
        let imgID = user.imageid;
        let fileUrl;
        if (user.file != undefined) {
            try {
                deleteProfile(user.imageid);
                // Convert URL to File
                uploadedFile = await uploadProfile(user.file[0]);
                if (!uploadedFile) throw Error();
                // Get file URL
                fileUrl = storage.getFileView(appwriteConfig.profileStorageId, uploadedFile.$id);
                if (!fileUrl) {
                    deleteProfile(uploadedFile.$id);
                    throw Error();
                }

                imgID = uploadedFile.$id;

            } catch (error) {
                console.error('Error:', error);
            }
        }
        //makes changes in the auth
        //update name 
        const promise = account.updateName(user.username)
        if (!promise) throw Error

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
        if (user.role == "student") {
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
                alert("Account updated successfully.");
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
                alert("Account updated successfully.");
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
                alert("Account updated successfully.");
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
                alert("Account updated successfully.");
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
        const newAccount = await account.create(
            user.userId,
            user.email,
            user.password,
            user.username
        );
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.username);
        let uploadedFile: any
        let fileUrl

        try {
            // Convert URL to File
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const filename = "image";
            const avatarFile = new File([blob], filename);

            // Upload the file
            uploadedFile = await uploadProfile(avatarFile);
            if (!uploadedFile) throw Error();

            // Get file URL
            fileUrl = storage.getFileView(appwriteConfig.profileStorageId, uploadedFile.$id);
            if (!fileUrl) {
                deleteProfile(uploadedFile.$id);
                throw Error();
            }

        } catch (error) {
            console.error('Error:', error);
        }

        await saveBuddyToDB({
            accountid: user.userId,
            bio: user.bio,
            username: user.username,
            imageUrl: fileUrl,
            imageid: uploadedFile.$id,
            contact: user.contact
        })
        const newUser = await saveUserToDB({
            accountid: user.userId,
            password: user.password,
            role: "buddy",
            email: user.email
        });
        alert("Buddy account created successfully.")
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
        //upload image to storage
        const updatedBuddy = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.buddyCollectionId,
            user.$id,
            {
                contact: user.contact,
                username: user.username,
                bio: user.bio,
                accountid: user.$id
            })
        if (!updatedBuddy) {
            await deleteFile(user.imageId);
            throw Error;
        }
        alert("Account updated successfully.")
        return updatedBuddy
    } catch (error) {
        console.log(error);
    }
}

//buddy from user collection by id
export async function getBuddyByIdU(userId: string) {
    try {
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
        alert("Post created successfully.");
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
            alert("Post updated successfully.");
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
        if (confirm("Do you want to delete the post?")) {
            const postInfo = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.officialPostsCollectionId,
                postId
            )
            const Gfile = storage.deleteFile(appwriteConfig.officialPostsStorageId, postInfo.imageId);
            if (!Gfile) throw Error

            const post = await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.officialPostsCollectionId,
                postId);

            if (!post) throw Error
            alert("Post deleted successfully.");
            window.location.reload()
        }
        else {
            return alert("Delete operation has been cancelled.");
        }

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
        alert("Group created successfully.")
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
            alert("Group updated successfully.")
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
        if (confirm("Do you want to delete the group?")) {
            const groupInfo = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.groupCollectionId,
                groupId
            )
            const Gfile = storage.deleteFile(appwriteConfig.profileStorageId, groupInfo.imageId);
            if (!Gfile) throw Error

            await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.groupCollectionId,
                groupId);
            return alert("Group deleted successfully.")
        }
        else {
            return alert("Delete operation has been cancelled.");
        }

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
    try {
        const Nuser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.groupCollectionId,
            user.groupId,
            {
                studentId: user.userId
            })
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
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

//counsellor (create and add buddy to user and buddy collection)
export async function addCounsellor(user: INewCounsellor) {
    try {
        const newAccount = await account.create(
            user.userId,
            user.email,
            user.password,

            user.username
        );
        if (!newAccount) throw Error;

        // Assuming avatars.getInitials(user.username) returns a URL
        const avatarUrl = avatars.getInitials(user.username);
        let uploadedFile: any
        let fileUrl

        try {
            // Convert URL to File
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const filename = "image";
            const avatarFile = new File([blob], filename);

            // Upload the file
            uploadedFile = await uploadProfile(avatarFile);
            if (!uploadedFile) throw Error();

            // Get file URL
            fileUrl = storage.getFileView(appwriteConfig.profileStorageId, uploadedFile.$id);
            if (!fileUrl) {
                deleteProfile(uploadedFile.$id);
                throw Error();
            }

        } catch (error) {
            console.error('Error:', error);
        }

        await saveCounsellorToDB({
            accountid: user.userId,
            block: user.block,
            bio: user.bio,
            username: user.username,
            imageUrl: fileUrl,
            imageid: uploadedFile.$id,
            contact: user.contact
        })
        const newUser = await saveUserToDB({
            accountid: user.userId,
            password: user.password,
            role: "counsellor",
            email: user.email
        });
        alert("Counsellor account created successfully.")
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

        const res = await fetch(`https://counselease-connect-1.onrender.com/deleteUser/${user.$id}`);
        await res.json();
        const newAccount = await account.create(
            user.$id,
            user.email,
            user.password,
            user.username
        );
        if (!newAccount) throw Error;

        const updatedCousellor = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                accountid: user.$id,
                password: newAccount.password,
                role: "counsellor",
                email: newAccount.email
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
        const updatedCousellor = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.counsellorCollectionId,
            user.$id,
            {
                accountid: user.$id,
                bio: user.bio,
                username: user.username,
                contact: user.contact
            })
        if (!updatedCousellor) {
            await deleteFile(user.imageId);
            throw Error;
        }
        alert("Account updated successfully.")
        return updatedCousellor
    } catch (error) {
        console.log(error);
    }
}

//counsellor from user collection by id
export async function getCounsellorByIdU(userId: string) {
    try {
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

export async function DeletePost(postid: string) {
    const tasks = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.groupPostsCollectionId,
        postid
    )
    if (!tasks)
        throw Error
    alert("Post deleted successfully.")
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

export async function AddSchedule(user: ISchedule): Promise<any> {
    try {
        const Nuser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.scheduleCollectionId,
            user.counsellorid,
            {
                counsellorid: user.counsellorid,
                days: user.days,
                timeslot: user.timeslot,
                status: user.status,
                dates: user.dates
            })
        if (!Nuser) {
            throw Error;
        }
        alert("Schedule uploaded successfully.")
        window.location.reload()
    } catch (error) {
        return error
    }
}

export async function getScheduleById(userId: string) {
    try {
        const schedule = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.scheduleCollectionId,
            userId
        )
        return schedule
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentSchedule() {
    try {
        const schedule = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.scheduleCollectionId,
        )
        return schedule
    } catch (error) {
        console.log(error)
    }
}

export async function updateSchedule(user: ISchedule) {
    try {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.scheduleCollectionId,
            user.counsellorid,
            {
                counsellorid: user.counsellorid,
                days: user.days,
                timeslot: user.timeslot,
                status: user.status,
                dates: user.dates
            })
        alert("Schedule updated successfully.")
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
}

export async function updateScheduleStatus(counsellorid: string, status: string[]) {
    try {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.scheduleCollectionId,
            counsellorid,
            {
                status: status,
            })
        return
    } catch (error) {
        console.log(error)
    }
}

//appointments
export async function AddAppointment(user: IAppointment): Promise<any> {
    try {
        const Nuser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.appointmentCollectionId,
            v4(),
            {
                counsellorid: user.counsellorid,
                studentid: user.studentid,
                Semail: user.semail,
                Scontact: user.scontact,
                Ccontact: user.ccontact,
                date: user.date,
                timeslot: user.timeslot,
                message1: "false",
                message2: "false"
            })
        if (!Nuser) {
            throw Error;
        }
        alert("Appointment booked successfully.")
        return window.location.reload()
    } catch (error) {
        return error
    }
}

export async function getRecentAppointment() {
    try {
        const schedule = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.appointmentCollectionId,
        )
        return schedule
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentStudents() {
    const counsellor = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.studentCollectionId,
    )
    if (!counsellor) throw Error
    return counsellor
}

export async function getUser() {
    const counsellor = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
    )
    if (!counsellor) throw Error
    return counsellor
}

export async function getStudent() {
    const counsellor = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.studentCollectionId,
    )
    if (!counsellor) throw Error
    return counsellor
}

export async function getStudentById(userId: string) {
    try {
        const schedule = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentCollectionId,
            userId
        )
        return schedule
    } catch (error) {
        console.log(error)
    }
}

export async function getAppointmentById(userId: string) {
    try {
        const schedule = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.appointmentCollectionId,
            userId
        )
        return schedule
    } catch (error) {
        console.log(error)
    }
}

export async function deleteAppointment(ID: string) {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.appointmentCollectionId,
            ID
        )
        alert("Appointment cancelled successfully.")
        return
    } catch (error) {

    }
}

export async function completeAppointment(ID: string) {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.appointmentCollectionId,
            ID
        )
        alert("Appointment completed.")
        return
    } catch (error) {

    }
}


//summary 
export async function AddSummary(user: ISummary) {
    try {
        const summary = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.summaryCollectionId,
            user.idd,
            {
                counsellorid: user.counsellorid,
                studentcode: user.studentcode,
                studentid: user.studentid,
                regno: user.regno
            })
        if (!summary) {
            throw Error;
        }
        return summary
    } catch (error) {
        return error
    }
}

export async function updateSummary(user: ISummary) {
    try {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.summaryCollectionId,
            user.idd,
            {
                summary: user.summary
            })
        alert("Summary updated successfully.")
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
}


export async function getSummary(regno: string) {
    const summary = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.summaryCollectionId,
        [
            Query.equal('regno', [regno]),
        ]
    )
    if (!summary) throw Error
    return summary
}

export async function getSummaryById(idd: string) {
    try {
        const schedule = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.summaryCollectionId,
            idd
        )
        return schedule
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentSummary() {
    const summary = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.summaryCollectionId,
    )
    if (!summary) throw Error
    return summary
}

export async function AddTask(task: IActivity) {
    const tasks = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        v4(),
        {
            title: task.title,
            isCompleted: task.isCompleted
        }
    )
    if (!tasks)
        throw Error
    console.log(tasks)
}

export async function UpdateTask(task: IActivity) {
    const tasks = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        task.id,
        {
            isCompleted: task.isCompleted
        }
    )
    if (!tasks)
        throw Error
    console.log(tasks)
}

export async function DeleteTask(taskid: string) {
    const tasks = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
        taskid
    )
    if (!tasks)
        throw Error
    console.log(tasks)
}

export async function getRecentTasks() {
    const summary = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.activityCollectionId,
    )
    if (!summary) throw Error
    return summary
}
