import { DatabasesIndexType, OrderBy, Permission } from "node-appwrite";

import { db, questionCollection } from "../name";
import { databases } from "./config";

async function ensureQuestionCollection() {
    try {
        await databases.getCollection(db, questionCollection);
    } catch {
        await databases.createCollection({
            databaseId: db,
            collectionId: questionCollection,
            name: questionCollection,
            permissions: [
                Permission.read("any"),
                Permission.read("users"),
                Permission.create("users"),
                Permission.update("users"),
                Permission.delete("users"),
            ],
        });
        console.log("Question collection created");
    }
}

async function ensureStringAttribute(
    key: string,
    size: number,
    required: boolean,
    array = false
) {
    const attributes = await databases.listAttributes(db, questionCollection);
    const exists = attributes.attributes.some(attribute => attribute.key === key);

    if (exists) return;

    await databases.createStringAttribute(db, questionCollection, key, size, required, undefined, array);
    console.log(`Question attribute created: ${key}`);
}

async function ensureIndex(key: string, type: DatabasesIndexType, attributes: string[]) {
    const indexes = await databases.listIndexes(db, questionCollection);
    const exists = indexes.indexes.some(index => index.key === key);

    if (exists) return;

    try {
        await databases.createIndex(db, questionCollection, key, type, attributes, [OrderBy.Asc]);
        console.log(`Question index created: ${key}`);
    } catch (error) {
        console.error(`Error creating question index ${key}:`, error);
    }
}

export default async function createQuestionCollection() {
    await ensureQuestionCollection();

    await ensureStringAttribute("title", 100, true);
    await ensureStringAttribute("content", 10000, true);
    await ensureStringAttribute("authorId", 50, true);
    await ensureStringAttribute("tags", 50, false, true);
    await ensureStringAttribute("attachmentId", 50, false);

    await Promise.all([
        ensureIndex("title", DatabasesIndexType.Fulltext, ["title"]),
        ensureIndex("content", DatabasesIndexType.Fulltext, ["content"]),
        ensureIndex("authorId", DatabasesIndexType.Key, ["authorId"]),
        ensureIndex("tags", DatabasesIndexType.Key, ["tags"]),
        ensureIndex("attachmentId", DatabasesIndexType.Key, ["attachmentId"]),
    ]);
}
