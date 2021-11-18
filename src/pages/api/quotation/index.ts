import type { NextApiRequest, NextApiResponse } from "next";

import jwt, { JwtPayload } from "jsonwebtoken";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase/clientApp";

import { calcTotal, validateAge, validateDates } from "../../../utils/helpers";

interface QuotationRequest {
  age: number;
  currency_id: string;
  start_date: string;
  end_date: string;
}

interface QuotationResponse {
  total: number;
  currency_id: string;
  quotation_id: number;
}

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
  const { user } = decodedToken as JwtPayload;
  const { method } = req;

  // filter out non-post requests
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  // Check that required params are present
  const { age, currency_id, start_date, end_date }: QuotationRequest = req.body;
  if ((age !== 0 && !age) || !currency_id || !start_date || !end_date) {
    res.statusCode = 400;
    res.json({ error: "Error: Missing required params" });
    return;
  }

  // Validate params
  if (!validateDates(start_date, end_date) || !validateAge(age)) {
    res.statusCode = 400;
    res.json({ error: "Error: Invalid params" });
    return;
  }

  // Calculate the quote total
  const total = calcTotal(age, start_date, end_date);

  // Post a new quotation to the db
  try {
    const quote = await addDoc(collection(db, "quotes"), {
      age,
      currency_id,
      start_date,
      end_date,
      total,
      created_at: new Date(),
      created_by: user.id,
    });

    res.status(200).json({
      quotation_id: quote.id,
      currency_id,
      total,
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: "Error: Could not add quote" });
    return;
  }
}
