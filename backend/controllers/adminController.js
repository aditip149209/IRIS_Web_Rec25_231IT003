import db from "../models/index.js";
import { InsertNewEquipment, updateEq, deleteEquip, updateFac, deleteFac, InsertNewFac } from "../models/services/FacEq.js";


const adminBoard = (req,res) => {
    return res.status(200).json({
        message: "this is the admin endpoint",
    });
};

const addEquipment = async (req,res) => {
    const {name, sport, stockcount} = req.body;
    if(!name || !sport || !stockcount) {
        return res.status(400).json({
            message: "Please provide all the required fields"
        });
    }
    try{
        const check = await db.Equipment.findOne({
            where: {Ename: name}
        });
        if(check){
            return res.status(400).json({
                message: "Equipment already exists"
            })
        }
        const createdEquipment = await InsertNewEquipment(name, sport, stockcount);
        return res.status(200).json({
            message: "Equipment added",
            createdEquipment
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error adding new equipment"
        })
    }
};

const updateEquipment = async (req,res) => {
    const {EqId, Name, Sport, StockCount, StatusReserved, StatusAvailable, StatusBooked} = req.body;
    if(!EqId || !Name || !Sport || !StockCount || !StatusReserved || !StatusAvailable || !StatusBooked) {
        return res.status(400).json({
            message: "Please provide all the required fields"
        });
    }
    try{
        const updates = await updateEq(EqId, Name, Sport, StockCount, StatusReserved, StatusAvailable, StatusBooked);
        return res.status(200).json({
            message: "Equipment updated",
            updates
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error updating the equipment"
        });
    }
};

const deleteEquipment = async (req,res) => {
    const {EqId} = req.body;
    if(!EqId){
        return res.status(400).json({
            message: "Please provide the equipment id"
        });
    }
    try{
        const deleteEq = await deleteEquip(EqId);
        return res.status(200).json({
            message: "Equipment has been deleted"
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error deleting the equipment"
        });
    }
    
};


const showAnalytics = async (req, res) => {
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


const updateFacility = async (req, res) => {
    const {Fid, Name, Sport, Location, Type, Status} = req.body;
    if(!Fid || !Name || !Sport || !Location || !Type || !Status) {
        return res.status(400).json({
            message: "Please provide all the required fields"
        });
    }
    try{
        const updates = await updateFac(Fid, Name, Sport, Location, Type, Status);
        return res.status(200).json({
            message: "Facility updated",
            updates
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error updating the facility"
        });
    }
};

const deleteFacility = async (req, res) => {
    const {facId} = req.body;
    if(!facId){
        return res.status(400).json({
            message: "Please provide the facility id"
        });
    }
    try{
        const deleteF = await deleteFac(facId);
        return res.status(200).json({
            message: "facility has been deleted"
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error deleting the facility"
        });
    }
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

const addFacility = async (req, res) => {
    const { sport, name, location, type } = req.body;
    if(!sport || !location || !type || !name) {
        return res.status(400).json({
            message: "Please provide all the required fields"
        });
    }
    try {
        const check = await db.Facility.findOne({
            where: {name: name}
        });
        if(check) {
            return res.status(400).json({
                message: "Facility already exists"
            });
        }
        const createdFacility = await InsertNewFac( sport, name, location, type );  

        return res.status(200).json({
            message: "Facility added",
            createdFacility
        });
    }
    catch(err){
        return res.status(500).json({
            message: "There was an error adding new facility"
        })
    }   
};   


export {adminBoard, addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility};