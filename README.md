# Strapi PoC

- Content types: Page, Post, Settings (single), Action (whitelist)
- Draft & Publish enabled for Page/Post
- ~~S3-compatible upload provider configured via env (use R2, B2, etc.)~~ GitHub Repo for storing files for testing purposes
- Revalidate webhook on publish to refresh Next.js ISR pages

## Local
cp .env.example .env
npm install
npm run develop
# visit http://localhost:1337/admin
