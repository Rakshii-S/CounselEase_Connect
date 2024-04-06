import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
    url: 'https://cloud.appwrite.io/v1',
    projectId: '65eea61f1a70e314b9a4',
    databaseId: '65eeb8ce999889bf3cc1',
    postsStorageId: '66103a231546d980c23a',
    officialPostsStorageId: '65f1b3e1e28a294d7c71',
    officialPostsCollectionId: '65f1afd8c78ab947dfc6',
    profileStorageId: '65f1b4db3070ff8db8e7',
    userCollectionId: '6601a3423a471b23a73c',
    adminCollectionId: '66019a6fdaf6a0646b39',
    groupCollectionId: '65fc5a15bb58504703b5',
    groupPostsCollectionId: '66019aa428fb7640d47e',
    counsellorCollectionId: '6601cdb1b364680acbc5',
    buddyCollectionId: '65ef1241f38f7e13b72b',
    studentCollectionId: '65eed3bb5b32310cd9db'
}

export const client = new Client();
client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);