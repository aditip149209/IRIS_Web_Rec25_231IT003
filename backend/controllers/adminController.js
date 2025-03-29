import db from "../models/index.js";
import { InsertNewEquipment, updateEq, deleteEquip, updateFac, deleteFac, InsertNewFac } from "../models/services/FacEq.js";

const adminBoard = (req,res) => {
    return res.status(200).json({
        message: "this is the admin endpoint",
    });
};

const addEquipment = async (req, res) => {
    const { name, sport, stockcount } = req.body;

    if (!name || !sport || !stockcount) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    if (typeof stockcount !== "number" || stockcount <= 0) {
        return res.status(400).json({
            message: "Stock count must be a positive number",
        });
    }

    try {
        const check = await db.Equipment.findOne({
            where: { Ename: name, Sport: sport }, // Check for duplicate name and sport
        });
        if (check) {
            return res.status(400).json({
                message: "Equipment already exists for this sport",
            });
        }

        const createdEquipment = await InsertNewEquipment(name, sport, stockcount);
        return res.status(200).json({
            message: "Equipment added",
            createdEquipment,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error adding new equipment",
            error: err.message,
        });
    }
};

const updateEquipment = async (req, res) => {
    const { EqId, Name, Sport, StockCount, StatusReserved, StatusAvailable, StatusBooked } = req.body;

    if (!EqId || !Name || !Sport || !StockCount || StatusReserved === undefined || StatusAvailable === undefined || StatusBooked === undefined) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    if (typeof StockCount !== "number" || StockCount <= 0) {
        return res.status(400).json({
            message: "Stock count must be a positive number",
        });
    }

    if (StatusReserved + StatusAvailable + StatusBooked > StockCount) {
        return res.status(400).json({
            message: "The sum of reserved, available, and booked statuses cannot exceed the stock count",
        });
    }

    try {
        const equipment = await db.Equipment.findOne({ where: { EqId } });
        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found",
            });
        }

        const updates = await updateEq(EqId, Name, Sport, StockCount, StatusReserved, StatusAvailable, StatusBooked);
        return res.status(200).json({
            message: "Equipment updated",
            updates,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error updating the equipment",
            error: err.message,
        });
    }
};

const deleteEquipment = async (req, res) => {
    const { EqId } = req.body;

    if (!EqId) {
        return res.status(400).json({
            message: "Please provide the equipment ID",
        });
    }

    try {
        const equipment = await db.Equipment.findOne({ where: { EqId } });
        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found",
            });
        }

        const deleteEq = await deleteEquip(EqId);
        return res.status(200).json({
            message: "Equipment has been deleted",
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error deleting the equipment",
            error: err.message,
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


const addFacility = async (req, res) => {
    const { sport, name, location, type } = req.body;

    if (!sport || !name || !location || !type) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    const validTypes = ["court", "field", "gym", "pool"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({
            message: `Invalid facility type. Valid types are: ${validTypes.join(", ")}`,
        });
    }

    try {
        const check = await db.Facility.findOne({ where: { name, sport } });
        if (check) {
            return res.status(400).json({
                message: "Facility already exists for this sport",
            });
        }

        const createdFacility = await InsertNewFac(sport, name, location, type);
        return res.status(200).json({
            message: "Facility added",
            createdFacility,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error adding new facility",
            error: err.message,
        });
    }
};

const updateFacility = async (req, res) => {
    const { Fid, Name, Sport, Location, Type, Status } = req.body;

    if (!Fid || !Name || !Sport || !Location || !Type || !Status) {
        return res.status(400).json({
            message: "Please provide all the required fields",
        });
    }

    const validTypes = ["court", "field", "gym", "pool"];
    const validStatuses = ["available", "booked", "maintenance", "reserved"];

    if (!validTypes.includes(Type)) {
        return res.status(400).json({
            message: `Invalid facility type. Valid types are: ${validTypes.join(", ")}`,
        });
    }

    if (!validStatuses.includes(Status)) {
        return res.status(400).json({
            message: `Invalid facility status. Valid statuses are: ${validStatuses.join(", ")}`,
        });
    }

    try {
        const facility = await db.Facility.findOne({ where: { Fid } });
        if (!facility) {
            return res.status(404).json({
                message: "Facility not found",
            });
        }

        const updates = await updateFac(Fid, Name, Sport, Location, Type, Status);
        return res.status(200).json({
            message: "Facility updated",
            updates,
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error updating the facility",
            error: err.message,
        });
    }
};

const deleteFacility = async (req, res) => {
    const { facId } = req.body;

    if (!facId) {
        return res.status(400).json({
            message: "Please provide the facility ID",
        });
    }

    try {
        const facility = await db.Facility.findOne({ where: { Fid: facId } });
        if (!facility) {
            return res.status(404).json({
                message: "Facility not found",
            });
        }

        const deleteF = await deleteFac(facId);
        return res.status(200).json({
            message: "Facility has been deleted",
        });
    } catch (err) {
        return res.status(500).json({
            message: "There was an error deleting the facility",
            error: err.message,
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



export {adminBoard, addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility};