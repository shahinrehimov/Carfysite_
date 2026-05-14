module.exports = {
  apps: [
    {
      name: "carfy",
      script: "node .next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
