import type { NextApiRequest, NextApiResponse } from "next";

import jwt, { JwtPayload } from "jsonwebtoken";

import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../../../utils/firebase/clientApp";

// TODO -- add a secret key to the .env file
// Load that into Vercel env vars in a real app
const SECRET = "secret";

// Middleware to check for a valid token
// In a prod environment, this should be an actual middleware function
// but cheating a little bit here for the sake of the challenge
const ensureToken = (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.statusCode = 401;
    res.json({ error: "Error: No authorization header provided" });
    return;
  }

  // Pull the token out of the header
  const token = auth.split(" ")[1];
  if (!token) {
    res.statusCode = 401;
    res.json({ error: "Error: No token provided" });
    return;
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    res.statusCode = 403;
    res.json({ error: "Error: Invalid token" });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decodedToken = ensureToken(req, res);
  const { user } = decodedToken as JwtPayload;
  const {
    method,
    query: { id },
  } = req;

  // Filter out non-get requests
  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  // get the quote
  try {
    const quote = await (
      await getDoc(doc(collection(db, "quotes"), id as string))
    ).data();
    const {
      age,
      currency_id,
      start_date,
      end_date,
      total,
      created_at,
      created_by,
    } = quote;

    res.status(200).json({
      age,
      currency_id,
      start_date,
      end_date,
      total,
      created_at,
      created_by,
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: "Error: Could not fetch quote" });
    return;
  }
}
