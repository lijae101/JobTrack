
import clientPromise from "@/lib/mongodb";
import type { JobApplication } from "./application";

export async function getApplicationsCollection() {
  const client = await clientPromise;

  const db = client.db("jobtrack");

  const collection = db.collection<JobApplication>("applications");

  // Ensure each user's applications can be queried efficiently.
  await collection.createIndex({ userId: 1 });

  return collection;
}
