import { Client, Databases, Storage, Account } from "appwrite";

const client = new Client();
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject("67160cf30001beb225c8"); // Your Appwrite Project ID

export { databases, storage, account };