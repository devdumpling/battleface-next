import type { NextApiRequest, NextApiResponse } from "next";

import jwt, { JwtPayload } from "jsonwebtoken";

// TODO -- add a secret key to the .env file
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

// A bit contrived/hacky, but since we aren't doing authentication this'll do in a pinch
// as a currentUser solution
export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const decodedToken = ensureToken(req, res);
  const { user } = decodedToken as JwtPayload;

  switch (method) {
    case "GET":
      // Normally we'd get data from the db here
      // but we're only storing username and id
      // and those are already in the token, so it's a bit contrived
      res.status(200).json({ user });
      break;
    case "PUT":
      // TODO this is where we'd put data in the db if we were updating
      // Just some boilerplate for now
      res.status(200).json({ message: "Successfully updated user" });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
