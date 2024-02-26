# Welcome to CitySchedules.us (powered by Remix)!

This is the source code for (https://cityschedules.us). This website is designed to simplify understanding and tracking your various city pickup services. Why is it open source? Because this web-app scratches my own itch of wanting a site that makes it dead simple to answer the following questions:

1. Is recycle getting picked up this week?
1. How does the holiday affect my trash pickup?
1. When is my next leaf pickup? _(Coming Soon)_

And if providing the code as Open Source software helps anyone learn... then that's an added benefit.

**Currently serving Madison, Wisconsin**

## Development Commands

### `npm run dev`

You will be running two processes during development:

- The Miniflare server (miniflare is a local environment for Cloudflare Workers)
- The Remix development server

Both are started.

Open up [http://127.0.0.1:8787](http://127.0.0.1:8787) and you should be ready to go!

### `npm run build && npm start`

Previews the production build.

## Deployment

If you don't already have an account, then [create a cloudflare account here](https://dash.cloudflare.com/sign-up) and after verifying your email address with Cloudflare, go to your dashboard and set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

### `npm run deploy-staging`

Deploys to [staging](https://cityschedules-us-staging.jordmantheman.workers.dev) environment.

### `npm run deploy-production`

Deploys to [production](https://cityschedules.us) environment.
