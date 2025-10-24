module.exports = ({ env }) => ({
  url: env('PUBLIC_URL', undefined),
  app: { keys: env.array('APP_KEYS') },
});
