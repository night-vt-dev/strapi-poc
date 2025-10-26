// config/middlewares.js
module.exports = [
  'strapi::errors',

  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true, // keep Helmet defaults (including upgrade-insecure-requests)
        directives: {
          // allow GitHub-hosted images in Admin UI
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
            'https://raw.githubusercontent.com',
            'https://*.githubusercontent.com',
            'https://*.r2.dev/',
            'https://*.r2.cloudflarestorage.com'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://raw.githubusercontent.com',
            'https://*.githubusercontent.com',
          ],
          // leave everything else to defaults
        },
      },
    },
  },

  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://your-frontend-domain.com',
      ],
      methods: ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'],
      headers: ['Content-Type','Authorization','Range'],
      keepHeaderOnError: true,
    },
  },

  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
