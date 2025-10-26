# Strapi PoC

- Content types: Page, Post, Settings (single), Action (whitelist)
- Draft & Publish enabled for Page/Post
- ~~S3-compatible upload provider configured via env (use R2, B2, etc.)~~ GitHub Repo for storing files for testing purposes
- Revalidate webhook on publish to refresh Next.js ISR pages


## Supabase setup
create a project
use connect with session pooler

## GitHub storage for media
setup a git

create a Private Access Token restricted to that git
give it only Contents read/write access.

```bash
GH_REPO=<user>/<name>
GH_TOKEN=PrivateAccessToken
GH_BRANCH=<branch-name>
GH_BASE_PATH=<subfolder-uploads>
GH_PUBLIC_BASE_URL=https://raw.githubusercontent.com/<GH_REPO>/<GH_BRANCH>
```

## Local
cp .env.example .env
npm install
npm run develop
# visit http://localhost:1337/admin
