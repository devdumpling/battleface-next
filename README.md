# Battleface Full Stack Coding Challenge

[Devon Wells](https://www.github.com/devdumplin), 11.16.21

This repo documents my process and links to the used repositories/further documentation. 

I'm going to write it in a conversational manner, sort of like a blog. That way you can get an insight into what I'm thinking in my approach!

## Tech Used

Next.js

## Blog

### Init

The first thing I do is bootstrap a simple Next app with Chakra-UI and Typescript. This gets us going. 
Normally I would add ESLint after that for some basic linting, but Next 12 is now bundled with ESLint out of the box. 

Running `yarn dev` gets our local server going and everything looks good. Perfect.

### API

Okay we're going to be building an API deployed to serverless functions using Next. 
Next makes this ezpz. We're going to create an `api` dir under `pages` and build our functions in here.

To test things out let's just make a health check first. 

```ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200;
  res.json({ status: 'ok' });
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
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// TODO -- add a secret key to the .env file
const SECRET = 'secret'

export default function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (!req.body) {
    res.statusCode = 400;
    res.json({ error: 'Error: No request body' });
    return;
  }

  // TODO add authentication -- maybe out of scope for this challenge  
  const { username, password } = req.body;

  if (!username) {
    res.statusCode = 400;
    res.json({ error: 'Error: Please provide a username' });
    return;
  }

  res.json({
    token: jwt.sign({ username }, SECRET),
    data: {
      username
    }
  })
}
```

That'll get us going. Now if we hit `/api/login` with a POST request containing `body.username`, it'll give us back a signed JWT. Cool.

**Test Protected Route**

Now that we have a way to retrieve a token, let's try storing that token in localStorage and hitting a protected route with it. First, we'll need a protected route. 

## API

I'll use Vercel serverless functions as the backbone of this simple API.

## Client App

Quickly bootstrapped a Next app with Chakra-UI and Typescript.

