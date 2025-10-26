// config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-github',
      providerOptions: {
        repo: env('GH_REPO'),                  // e.g. "owner/site-media"
        token: env('GH_TOKEN'),                // PAT (contents: write)
        branch: env('GH_BRANCH', 'main'),
        basePath: env('GH_BASE_PATH', 'uploads'),
        publicBaseUrl: env('GH_PUBLIC_BASE_URL'), // e.g. "https://raw.githubusercontent.com/owner/site-media/main"
        // Optional committer identity:
        commitUsername: env('GH_COMMIT_USER', 'strapi-bot'),
        commitEmail: env('GH_COMMIT_EMAIL', 'strapi-bot@local')
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      breakpoints: { large: 1000, medium: 750, small: 500, thumbnail: 245 },
    },
  },
});
console.log('[UPLOAD:GITHUB] repo=%s baseUrl=%s',
  process.env.GH_REPO, process.env.GH_PUBLIC_BASE_URL);
