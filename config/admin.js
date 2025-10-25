// config/admin.js
module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'), // keep this in .env / Cloud Run env
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),     // already in your .env
  },
  transfer: {
    token: { salt: env('API_TOKEN_SALT') }, // optional fallback
  },
});