import { sequelize } from "../../utils/database.js";
import db from "../index.js";

const GetUserById = async (Uid) => {
    try {
        const user = await db.Users.findOne({ where: { Uid: Uid } });
        return user;
    } catch (error) {
        console.error("Error fetching user by uid:", error);
        
    }
}

const GetUserByEmail = async (email) => {
    try {
        const user = await db.Users.findOne({ where: { Email: email } });
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        
    }
};

export { GetUserById,GetUserByEmail };

