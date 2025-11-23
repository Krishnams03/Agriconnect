import type { NextApiRequest, NextApiResponse } from "next";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || "",
  server: process.env.MAILCHIMP_SERVER_PREFIX || "",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Debugging logs
  console.log("MAILCHIMP_LIST_ID:", process.env.MAILCHIMP_LIST_ID);

  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!listId) {
    console.error("Error: MAILCHIMP_LIST_ID is not defined in environment variables.");
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
    });

    return res.status(200).json({ message: "Successfully subscribed!", data: response });
  } catch (error: any) {
    console.error("Mailchimp API Error:", error.response?.text || error.message);
    return res.status(500).json({ 
      error: "Failed to subscribe", 
      details: error.response?.text || error.message 
    });
  }
}
