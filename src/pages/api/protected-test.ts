import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// TODO -- add a secret key to the .env file
const SECRET = "secret";

// Middleware to check for a valid token
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

  // Successful authentication, return the decoded token for now
  res.json({ decodedToken });
}
