import { BSON, MongoClient } from "mongodb";

const runtimeConfig = useRuntimeConfig();

const uri = runtimeConfig.MONGODB || "mongodb://localhost:27017";
const dbName = runtimeConfig.Database || "TorsoMatchVotes";
const collectionName = "Votes";

const client = new MongoClient(uri);

client.on("connectionReady", () => {
  console.log("Connected to Database");
  try {
    client.db(dbName).createCollection(collectionName);
  } catch (err) {}
});

client.connect();

type Vote = {
  _id: BSON.ObjectId;
  img: string;
  torsos: number[];
};

export async function getVotedImages() {
  const data = await client
    .db(dbName)
    .collection<Vote>(collectionName)
    .find()
    .toArray();

  return data.map((x) => x.img);
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    img: string;
    torsos: string[];
  }>(event);

  const collection = client.db(dbName).collection(collectionName);
  const result = await collection.findOne<Vote>({ img: body.img });
  if (!result) {
    const didInsert = await collection.insertOne({
      img: body.img,
      torsos: body.torsos,
    });
    return didInsert.acknowledged;
  }

  const didUpdate = await collection.updateOne(
    { _id: result._id },
    { $set: { torsos: body.torsos } }
  );

  return didUpdate.acknowledged;
});
