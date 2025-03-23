import { sequelize } from "../../utils/database.js";
import db from "../index.js";

const InsertIntoUser = async (data) => {
    try{
        const user = await Users.create(data);
        console.log("user created");
        return user;
    }
    catch(error){
        throw new Error(error);
    }
}

export default InsertIntoUser;
