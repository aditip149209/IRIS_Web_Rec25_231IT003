import { Sequelize } from "sequelize";


import configInfo from "./db.config.js";

const sequelize = new Sequelize(
    configInfo.DB,
    configInfo.USER,
    configInfo.PASSWORD,
    {
        host: configInfo.HOST,
        dialect: configInfo.DIALECT,
        logging: console.log,
    }
);

const connectDB = async () => {
    try {
      await sequelize.authenticate(); // Test connection
      console.log('✅ Successfully connected to database');
      await sequelize.sync({ force: true }); // Sync tables
      console.log('✅ Database and tables synced');
    } catch (error) {
      console.error('❌ Error syncing database:', error.message);
      console.error(error); // Full error stack trace
    }
  };
  
export {sequelize, connectDB};



