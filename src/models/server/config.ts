import env from '@/app/env';
import { Avatars, Client,Databases, Storage, Users } from 'node-appwrite';


const client = new Client()
    .setEndpoint(env.appwrite.endPoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apiKey) // Your secret API key
;

const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);
const avatars = new Avatars(client);



export {
    client,
    databases,
    storage,
    users,
    avatars
};
