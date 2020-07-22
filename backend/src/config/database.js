require('../bootstrap');

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  dialectOptions: {
    ssl: process.env.DB_SSL,
    rejectUnauthorized: false,
  },
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  storage: './__tests__/database.sqlite',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
