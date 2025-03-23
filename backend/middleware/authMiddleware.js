import jwt from 'jsonwebtoken';
import { GetUserById } from '../models/services/FindUser.js';

const protect = async (req, res, next) => {
    let token;
    console.log(req.headers);
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            const user = await GetUserById(decode.id);
            if(!user || user.length === 0){
                return res.status(401).json({
                    message: "Not authorized, user not found",
                });
            }
            req.user = {
                id: decode.id,
                role: decode.role
            };

            next();

        }
        catch(error){
            console.log(error);
            res.status(401).json({
                message: "Token failed",
            });            
        }
    }
    else{
        
        res.status(401).json({
          
            message: "No token lol",
        });
    }

};

export default protect;




