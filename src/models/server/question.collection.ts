import {DatabasesIndexType, Permission} from "node-appwrite"
import {db, questionCollection} from "../name"
import {databases} from "./config"

async function waitForAttribute(key: string, retries = 20, delayMs = 1500) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const attribute = await databases.getAttribute(db, questionCollection, key)

    if (attribute.status === "available") {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  throw new Error(`Attribute "${key}" did not become available in time`)
}



export default async function createQuestionCollection(){
  // create collection
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])
  console.log("Question collection is created")

  //creating attributes and Indexes

  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(db, questionCollection, "content", 10000, true),
    databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
    databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
    databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
  ]);
  console.log("Question Attributes created")

  await Promise.all([
    waitForAttribute("title"),
    waitForAttribute("content"),
  ])

  
  // create Indexes

  
  await Promise.all([
    databases.createIndex({
      databaseId: db,
      collectionId: questionCollection,
      key: "title_content_index",
      type: DatabasesIndexType.Fulltext,
      attributes: ["title", "content"],
      lengths: [],
    }),


  ])
    
}
