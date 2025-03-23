import db from "../models";
import { sequelize } from "../utils/database";
import { Op } from "sequelize";



const adminBoard = (req,res) => {
    return res.status(200).json({
        message: "this is the admin endpoint",
    });
};

const addEquipment = (req,res) => {
    
};

const updateEquipment = (req,res) => {
    return res.status(200).json({
        message: "you have reached the update endpoint"
    });
};

const deleteEquipment = (req,res) => {
    return res.status(200).json({
        message: "you have reached the delete endpoint"
    });
};


const showAnalytics = (req, res) => {
    return res.status(200).json({
        message: "you have reached the analytics endpoint"
    });
};

const showEquipment = async (req, res) => {
    const {sport} = req.body;
    if(!sport) {
        return res.status(400).json({
            message: "Please provide the sport"
        });
    }
    try{
        const equips = await db.Equipment.findAll({
            where:[ {Sport: sport}]
        })
    
        return res.status(200).json({
            message: "Here are the equipments",
            equips });
    }  
    catch(err){
        return res.status(500).json({
            message: "There was an error",
            error: err
        });
    }   
};

const updateFacility = (req, res) => {

};

const deleteFacility = (req, res) => {

};

const showFacility = async (req, res) => {
    const { sport } = req.body;
    if(!sport) {
        return res.status(400).json({
            message: "Please provide the sport"
        });
    }
    try{
        const facilities = await db.findAll({
            where: [{Sport: sport}]
        })
        return res.status(200).json({
            message: "Here are the facilities",
            facilities
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error",
            error: err
        });
    }
};

const addFacility = (req, res) => {
    const { sport, location } = req.body;
    if(!sport || !location) {
        return res.status(400).json({
            message: "Please provide all the required fields"
        });
    }
    db.Facility.create({
        sport: sport,
        location: location
    }).then(facility => {
        return res.status(200).json({
            message: "Facility added successfully",
            facility
        });
    }).catch(err => {
        return res.status(500).json({
            message: "There was an error",
            error: err
        });
    });

};   


export {adminBoard, addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility};