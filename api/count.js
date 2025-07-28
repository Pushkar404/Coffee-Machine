import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // increment counter
    const newCount = await kv.incr("coffee-count");
    return res.status(200).json({ count: newCount });
  } else if (req.method === "GET") {
    // get current count
    const count = (await kv.get("coffee-count")) || 0;
    return res.status(200).json({ count });
  }
}
