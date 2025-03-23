import bcrypt from "bcryptjs";
import { GetUserById,GetUserByEmail } from "../models/services/FindUser.js";
import InsertIntoUser from "../models/services/InsertUser.js";
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    // console.log(req.body);

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+])[A-Za-z\d@$!%*?&#^()_+]{8,}$/;
        return passwordRegex.test(password);
      };
    //first check if all field are valid i.e. email, uname and password are not null or invalid
    
    if(!username || !email || !password){
        return res.status(401).json({
            message: "Enter all values correctly"
        })
    }

    if(!isValidPassword(password)){
        return res.status(401).json({
            message: "Password should have atleast 8 characters with atleast 1 uppercase, 1 digit and 1 symbol",
        });
    }
    // then ill check if a user with this email already exists for not? 
    try{
        const userExists = await GetUserByEmail(email);
        console.log(userExists);
        if(userExists){
            return res.status(400).json({
                message: "User already exists?",
            });
        }
        // if none of the above cases hold, then i proceed to registering the user. 
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
            UName: username,
            Email: email,
            Password: hashedPassword,
        };
        const newUser = InsertIntoUser(data);
        return res.status(201).json({
            message: "user registered successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "There was an error registering",
        });
    }   
};

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "Enter password and email both",
        });
    }

    try{
        const user = await GetUserByEmail(email);

        // console.log(user);
        
        if(!user){
            console.log("here is error with user not existing in login");
            return res.status(400).json({
                message: "user does not exist",
            });
        }
        const pw = user.dataValues.Password;
        console.log(pw);

        const isPasswordCorrect = await bcrypt.compare(password, pw);

        if(!isPasswordCorrect){
            console.log("password incorrect");
            return res.status(401).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign({id: user.dataValues.Uid, role: user.dataValues.Role}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.status(200).json({
        message: "Login successful",
        token,
        user: user.dataValues.Uid});
    }
    catch(err){
        console.log(err);
        
        return res.status(500).json({message: "Server error"});
    }
};

export { loginUser, registerUser };
