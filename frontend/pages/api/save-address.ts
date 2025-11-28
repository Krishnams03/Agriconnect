import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!); // Ensure you have this in .env

interface SavedAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  username?: string;
  [key: string]: unknown;
}

const saveAddress = async (address: SavedAddress) => {
  try {
    await client.connect();
    const db = client.db("agriconnect");
    const collection = db.collection("addresses");

    const result = await collection.insertOne(address);
    return result;
  } finally {
    await client.close();
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const address = req.body as SavedAddress;

      // Call the function to save the address to the database
      const result = await saveAddress(address);
      
      res.status(200).json({ success: true, data: result });
    } catch (error: unknown) {
      console.error("Error saving address:", error);
      res.status(500).json({ success: false, message: "Failed to save address." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
