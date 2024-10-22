export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 3000,
    DATABASE: {
        HOST: process.env.DATABASE_HOST,
        PORT: parseInt(process.env.DATABASE_PORT, 10) || 27017,
        USERNAME: process.env.DATABASE_USER,
        PASSWORD: process.env.DATABASE_PASSWORD,
        NAME: process.env.DATABASE_NAME,
    },
});