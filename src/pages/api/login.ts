import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET = 'secret'

export default function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (!req.body) {
    res.statusCode = 400;
    res.json({ error: 'Error: No request body' });
    return;
  }

  // TODO add authentication -- maybe out of scope for this challenge
  const { username, password } = req.body;

  res.json({
    token: jwt.sign({ username }, SECRET),
    data: {
      username
    }
  })
}
