module.exports = ({ env }) => ({
  connection: env('DATABASE_CLIENT') === 'postgres' ? {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl:  {rejectUnauthorized: false },//env.bool('DATABASE_SSL', false),
      application_name: 'strapi',
    },
  } : {
    client: 'sqlite',
    connection: { filename: '.tmp/data.db' },
    useNullAsDefault: true,
  },
});
