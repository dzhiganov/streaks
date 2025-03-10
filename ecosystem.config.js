module.exports = {
  apps: [
    {
      name: 'habit-tracker',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        AUTH_ORIGIN: process.env.AUTH_ORIGIN,
        MONGODB_URI: 'mongodb+srv://test',
      },
    },
  ],
};
