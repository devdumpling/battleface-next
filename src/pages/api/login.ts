import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// TODO -- add a secret key to the .env file
const SECRET = "secret";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    res.statusCode = 400;
    res.json({ error: "Error: No request body" });
    return;
  }

  // TODO add authentication -- maybe out of scope for this challenge
  const { username, password } = req.body;

  if (!username) {
    res.statusCode = 400;
    res.json({ error: "Error: Please provide a username" });
    return;
  }

  // Mock user data
  const user = {
    id: 1,
    username: username,
  };

  res.json({
    token: jwt.sign({ user }, SECRET),
    user,
  });
}
