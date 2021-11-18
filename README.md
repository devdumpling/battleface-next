# Battleface Full Stack Coding Challenge

[Devon Wells](https://www.github.com/devdumpling), 11.16.21

I'm going to write this in a conversational manner, sort of like a blog. That way you can get an insight into what I'm thinking in my approach!

## Quotify

I'm calling the finished product `Quotify`.

[Check out the demo! Deployed on Vercel](https://battleface-next.vercel.app/)

![Quotify](/public/quotify.png)

It uses `Next.js` (a React-based framework for building powerful SSR/SSG SPAs) for the client and `Next API routes` to deploy serverless lambdas for handling our API. The project is fully deployed and hosted on Vercel. 

I also use GCP Firestore as a realtime, noSQL database to store quotes. This was mostly for convenience and to fit in with the serverless approach. This could have been set up to work with any DB.

One high level consideration I made early on is to focus on the API and authorization and mock authentication, so there's no formal user authentication process. Obviously, this would not be the approach in a real app. If I were to spend more time on this and extend it, I'd probably use Google OAuth (which is built into Firebase) since I'm already using that for db concerns.

Another thing I would add if I had more time is more robust error-handling on the frontend. Curently, if an error happens it just gets logged to `console.error`. I figured that was okay for this, especially since it's not being graded on design?

One final addition would be to handle currency codes properly. The prompt specified a rate for a few codes, so I'm using that across the board. I assume this should change depending on the code to some other rates. Ideally I'd handle the conversion and then also show the correct currency symbol on the frontend. It would also be nice to add features for selecting the currency codes (and a datepicker), but that felt unnecessary for a prototype. Hopefully that's an okay assumption!

Please don't hesitate to reach out with any questions, comments, or concerns!
I documented a lot of the code to make it clear what/why/how I do what I do.

## Core Tech Used

<p>
    <img alt="React" src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img alt="Next.js" src="https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white">
  <img alt="Firebase" src="https://img.shields.io/badge/-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=white">
  <img alt="Github" src="https://img.shields.io/badge/-Github-181717?style=flat-square&logo=github&logoColor=white">
  <img alt="ChakraUI" src="https://img.shields.io/badge/-Chakra UI-319795?style=flat-square&logo=chakra UI&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Nodejs" src="https://img.shields.io/badge/-Nodejs-43853d?style=flat-square&logo=Node.js&logoColor=white" />
  <img alt="VS Code" src="https://img.shields.io/badge/-VS Code-007ACC?style=flat-square&logo=VisualStudioCode&logoColor=white" />
  <img alt="Insomnia" src="https://img.shields.io/badge/-Insomnia-5849BE?style=flat-square&logo=insomnia&logoColor=white" />
</p>

## References

- [Next.js](https://nextjs.org/)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Google Firestore](https://firebase.google.com/docs/reference/js/firestore_.md?authuser=0#documentid)
- [Chakra-UI](https://chakra-ui.com/)


-----

## API

The API can be found at `src > pages > api`. Anything in here functions as a serverless route that gets deployed to Vercel as one of their handy dandy serverless functions.

### `quotation` (protected routes)
- `index.ts` handles `POST` requests for adding a quotation. 
- `[id].ts` handles `GET` at a specific quote id

### `user` (protected route)
- `[[...id]].ts` fetches user data given a JWT (by user data, really I just mean the mock data... the only user is `id: 1` with whatever name the client enters... so fairly contrived)

### `login`
- Takes a username (and as a TODO would take a password) and signs a JWT based on that and a mock user (always `id: 1`). 

### `protected-test`
- A quick and dirty test I used to test the JWT verification

### `status`
- Simple health check to make sure I can hit the API

## Client App

Quickly bootstrapped a Next app with Chakra-UI and Typescript.

The client app has a few key features. 

1. Login form
    - Hits `/api/login` with a username, returning a mock user and signed token. Stores the token in local storage (not ideal for prod envs due to attacks). Gives a base level of persistence though if a user refreshes the page or comes back to it. 
1. Quote Form
    - Once a user is logged in, they can request a quote by filling out the fields in the quote form. The form does validation, and then the API does validation as well. 
    - Submitting hits `/api/quotation` with the given params and the user id (always 1 in this demo). 
1. Current Quote
    - Component for rendering the quote returned from a successful hit of `/api/quotation`. Has some flashy count up animation. 
    - Clicking on `Stats for nerds` shows the fields from the response as well as the current token. Would not do this in a real site, obv.
1. Bonus: Quote Count/Avg Quote
    - Shows a **live** counter with the number of quotes Quotify has delivered as well as the average quote. This leans on the realtime aspect of Firestore. In a prod app I'd want to optimize this to not query the entire collection, as well as provide indexes, and honestly cache all of this robustly.
1. Bonus: Dark Mode (toggle at top right)
    - Got that one for free, thanks Chakra-UI!

------

## Dev Blog Explaining My Process

### Init

The first thing I do is bootstrap a simple Next app with Chakra-UI and Typescript. This gets us going.
Normally I would add ESLint after that for some basic linting, but Next 12 is now bundled with ESLint out of the box.

Running `yarn dev` gets our local server going and everything looks good. Perfect.

### API

Okay we're going to be building an API deployed to serverless functions using Next.
Next makes this ezpz. We're going to create an `api` dir under `pages` and build our functions in here.

To test things out let's just make a health check first. 

```ts
// src/api/pages/status.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.json({ status: "ok" });
}
```

Navigating to `localhost:3000/api/status` gives us the JSON we expect.

Since that works, let's move on to creating the necessary endpoints for our API. We'll make a `/login` endpoint that gives us back a token for a mocked user.

**Authorization**

Let's start with basic authorization via JWTs. We're going to skip over authentication and just have a mock user for now.

Add packages for JWT (and optionally types)

```
yarn add jsonwebtoken
yarn add @types/jsonwebtoken
```

Next we'll make a basic `/login` endpoint for retrieving a token. For now we're just going to give a token to any username. (re: there's no authentication).

For now we can keep it simple.

```ts
// login.ts
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

  res.json({
    token: jwt.sign({ username }, SECRET),
    data: {
      username,
    },
  });
}
```

That'll get us going. Now if we hit `/api/login` with a POST request containing `body.username`, it'll give us back a signed JWT. Cool.

**Test Protected Route**

Now that we have a way to retrieve a token, let's try storing that token in localStorage and hitting a protected route with it. First, we'll need a protected route.

```ts
// protected-test.ts
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
```

Author's Note: Alright, I started this blog but sadly did not quite have enough time to blog the whole process. I'm happy to explain my process on a call, though. Hopefully this has been enjoyable!

## Thank you again for your time and for reading!
