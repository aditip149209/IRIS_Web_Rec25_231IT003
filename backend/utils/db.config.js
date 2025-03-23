import dotenv from 'dotenv';

dotenv.config();

const configInfo = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    DIALECT: process.env.DB_DIALECT,
};


export default configInfo;