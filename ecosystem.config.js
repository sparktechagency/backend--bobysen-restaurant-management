module.exports = {
  apps: [
    {
      name: "server",
      script: "./dist/server.js",
      env: {
        NODE_ENV: "development",
        DATABASE_URL:
          "mongodb+srv://restaurant:WSC0b2Lhjzew2ETj@cluster0.dgoei.mongodb.net/restaurant?retryWrites=true&w=majority",
        PORT: 5005,
        SOCKET_PORT: 9005,
        IP: "64.227.132.142",
        BCRYPT_SALT_ROUNDS: 12,
        JWT_ACCESS_SECRET: "tidybayti2023",
        JWT_REFRESH_SECRET: "tidybayti2023",
        JWT_ACCESS_EXPIRES_IN: "30d",
        JWT_REFRESH_EXPIRES_IN: "365d",
        NODEMAILER_HOST_EMAIL: "nurmdopu529@gmail.com",
        NODEMAILER_HOST_PASS: "plyb rwmv zzyi bxzd",
        STRIPE_SECRET:
          "sk_test_51JxCs8L9MVzlfyPWBrdSppNnP55RJcU7VgaaVh7yzA4GQOkGp8HuZKPkEw1XUE8Q52PVkPmrvV9pX0voNBghZEqe0",
      },
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL:
          "mongodb+srv://restaurant:WSC0b2Lhjzew2ETj@cluster0.dgoei.mongodb.net/restaurant?retryWrites=true&w=majority",
        PORT: 5005,
        SOCKET_PORT: 9005,
        IP: "64.227.132.142",
        BCRYPT_SALT_ROUNDS: 12,
        JWT_ACCESS_SECRET: "tidybayti2023",
        JWT_REFRESH_SECRET: "tidybayti2023",
        JWT_ACCESS_EXPIRES_IN: "30d",
        JWT_REFRESH_EXPIRES_IN: "365d",
        NODEMAILER_HOST_EMAIL: "nurmdopu529@gmail.com",
        NODEMAILER_HOST_PASS: "plyb rwmv zzyi bxzd",
        STRIPE_SECRET:
          "sk_test_51JxCs8L9MVzlfyPWBrdSppNnP55RJcU7VgaaVh7yzA4GQOkGp8HuZKPkEw1XUE8Q52PVkPmrvV9pX0voNBghZEqe0",
      },
    },
  ],
};
